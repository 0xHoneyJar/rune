# Blockchain Inspector Skill

Read-only on-chain state inspection for debugging web3 components.

## Purpose

When `/observe diagnose` is invoked, this skill provides on-chain read capabilities to compare actual contract state with indexed/cached data (e.g., Envio).

## Capabilities

| Capability | Method | Fallback |
|------------|--------|----------|
| Read contract state | viem publicClient.readContract | cast call |
| Batch reads | multicall | Sequential cast |
| Get block number | eth_blockNumber | cast block-number |
| Compare sources | Envio query + on-chain | Manual |

## Invocation

Invoked automatically by `/observe diagnose` when debugging web3 components.

Can also be invoked directly:
```
/blockchain-inspector read <contract> <function> [args...]
/blockchain-inspector compare <component>
/blockchain-inspector block
```

## Implementation

### Option 1: Viem (Preferred - if in project)

Check for viem in package.json, then use:

```typescript
import { createPublicClient, http } from 'viem'
import { mainnet, berachain } from 'viem/chains'

// Auto-detect chain from project config
const chainId = await detectChainId()
const chain = getChainConfig(chainId)

const client = createPublicClient({
  chain,
  transport: http(process.env.RPC_URL)
})

// Read contract state
const balance = await client.readContract({
  address: VAULT_ADDRESS as `0x${string}`,
  abi: vaultAbi,
  functionName: 'balanceOf',
  args: [userAddress as `0x${string}`]
})

// Batch reads with multicall
const results = await client.multicall({
  contracts: [
    {
      address: VAULT_ADDRESS,
      abi: vaultAbi,
      functionName: 'balanceOf',
      args: [userAddress]
    },
    {
      address: REWARDS_ADDRESS,
      abi: rewardsAbi,
      functionName: 'earned',
      args: [userAddress]
    }
  ]
})
```

### Option 2: Cast (Foundry CLI fallback)

If viem not available but foundry is installed:

```bash
# Get current block
cast block-number --rpc-url $RPC_URL

# Read balance
cast call $VAULT "balanceOf(address)(uint256)" $USER --rpc-url $RPC_URL

# Read multiple values
cast call $VAULT "name()(string)" --rpc-url $RPC_URL
cast call $VAULT "symbol()(string)" --rpc-url $RPC_URL
cast call $VAULT "totalSupply()(uint256)" --rpc-url $RPC_URL

# Decode result
cast --to-dec $HEX_RESULT
cast --to-unit $WEI_RESULT ether
```

### Option 3: Raw JSON-RPC (Universal fallback)

Always available as last resort:

```bash
# Get block number
curl -s -X POST "$RPC_URL" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  | jq -r '.result' | xargs printf "%d\n"

# Read contract
curl -s -X POST "$RPC_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [{
      "to": "'$CONTRACT'",
      "data": "'$CALLDATA'"
    }, "latest"],
    "id": 1
  }' | jq -r '.result'
```

### Calldata Encoding

For raw JSON-RPC, encode function calls:

```bash
# balanceOf(address) = 0x70a08231
# Encode: 0x70a08231 + padded address (32 bytes)

function encode_balance_of() {
  local address=$1
  local padded=$(printf "%064s" "${address:2}" | tr ' ' '0')
  echo "0x70a08231${padded}"
}

# Example
CALLDATA=$(encode_balance_of "0x79092...")
```

## Output Format

### YAML (for craft-state.md integration)

```yaml
diagnostic:
  block: 15899150
  timestamp: "2026-01-20T15:45:00Z"
  chain_id: 80094
  rpc_url: "https://rpc.berachain.com"
  reads:
    - contract: "0x3bEC4..."
      name: "vault"
      function: "balanceOf"
      args: ["0x79092..."]
      result_raw: "0x0000000000000000000000000000000000000000000000000000000000000000"
      result_decoded: "0"
      result_formatted: "0 shares"
    - contract: "0x8d15E..."
      name: "multiRewards"
      function: "balanceOf"
      args: ["0x79092..."]
      result_raw: "0x000000000000000000000000000000000000000000000000727a6fc2c4cda000"
      result_decoded: "8250000000000000000"
      result_formatted: "8.25 shares"
  comparison:
    on_chain:
      vault_shares: "0"
      staked_shares: "8.25e18"
    envio:
      vault_shares: "8.25e18"
    mismatch: ["vault_shares"]
  diagnosis: "User has staked, but component queries vault"
```

### Display Format (for terminal)

```
┌─ On-Chain Reads ───────────────────────────────────────┐
│                                                        │
│  Block: 15,899,150                                     │
│  Chain: Berachain (80094)                              │
│                                                        │
│  vault.balanceOf(0x79092...):                          │
│  → 0 shares                                            │
│                                                        │
│  multiRewards.balanceOf(0x79092...):                   │
│  → 8.25 shares (8,250,000,000,000,000,000 wei)         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Configuration

### RPC URL Discovery

Reads RPC URL from (in priority order):

1. **Environment variables**:
   - `RPC_URL`
   - `VITE_RPC_URL`
   - `NEXT_PUBLIC_RPC_URL`
   - Chain-specific: `BERACHAIN_RPC_URL`, `MAINNET_RPC_URL`

2. **Project config** (envio.config.ts):
   ```typescript
   networks: [{
     id: 80094,
     rpc_config: { url: "${VITE_RPC_URL}" }
   }]
   ```

3. **Package.json scripts**:
   Look for `--rpc-url` flags in scripts

4. **Hardcoded fallbacks** (rate limited, use sparingly):
   - Ethereum: `https://eth.llamarpc.com`
   - Berachain: `https://rpc.berachain.com`

### Chain Detection

Detect chain from:
1. `envio.config.ts` network id
2. Contract addresses (known deployments)
3. User specification

### ABI Discovery

For function decoding, find ABIs in:
1. `artifacts/*.json` (hardhat/foundry)
2. `src/abi/*.ts` (exported ABIs)
3. `node_modules/@project/contracts`
4. Prompt for ABI if complex decoding needed

## Limitations

- **Read-only**: Cannot modify state (by design)
- **ABI required**: Complex return types need ABI for decoding
- **Rate limits**: Public RPCs have rate limits (~10-50 req/sec)
- **Private state**: Cannot read private/internal variables
- **Block lag**: On-chain reads are at "latest" block

## Security

- Never stores or logs private keys
- Never signs transactions
- Only reads public blockchain state
- RPC URLs may contain API keys - handle with care

## Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| "execution reverted" | Invalid args or state | Check contract exists, args valid |
| "RPC rate limited" | Too many requests | Wait and retry, or use different RPC |
| "invalid JSON-RPC response" | RPC issue | Try fallback RPC |
| "ABI decoding failed" | Missing/wrong ABI | Request ABI or use raw bytes |

## Integration with /observe diagnose

1. `/observe diagnose ComponentName` triggers skill
2. Skill reads component, extracts contracts
3. Skill executes on-chain reads
4. Results compared with Envio data
5. Findings saved to craft-state.md
6. Suggested fix returned to user
