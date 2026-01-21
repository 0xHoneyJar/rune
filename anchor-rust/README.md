# Anchor Rust

[![Anchor Rust CI](https://github.com/zksoju/sigil/actions/workflows/anchor-rust-ci.yml/badge.svg)](https://github.com/zksoju/sigil/actions/workflows/anchor-rust-ci.yml)

State-pinned blockchain development in Rust.

## Overview

Anchor provides deterministic blockchain development by forking networks at specific block heights and validating code against pinned state.

## Features

- **Fork Management**: Create and manage local Anvil forks of blockchain networks
- **State Pinning**: Bind tasks to specific EVM snapshots for reproducibility
- **Physics-Based Validation**: Apply Sigil design physics rules to code generation
- **Zone Security**: Enforce permission boundaries across operation types

## Installation

```bash
cargo install --path crates/anchor-cli
```

## Usage

```bash
# Create a fork of Ethereum mainnet
anchor fork --network mainnet --port 8545

# Show status
anchor status

# Get help
anchor --help
```

## Supported Networks

| Network | Chain ID | Alias |
|---------|----------|-------|
| Ethereum Mainnet | 1 | mainnet, ethereum, eth |
| Sepolia Testnet | 11155111 | sepolia |
| Base | 8453 | base |
| Arbitrum One | 42161 | arbitrum, arb |
| Optimism | 10 | optimism, op |
| Berachain | 80094 | berachain, bera |

## Development

```bash
# Build
cargo build

# Test
cargo test

# Lint
cargo clippy

# Format
cargo fmt
```

## Architecture

```
anchor-rust/
├── crates/
│   ├── anchor-core/    # Library crate
│   │   └── src/
│   │       ├── types/  # Core types (Zone, Network, Fork, Task, Physics)
│   │       ├── error.rs
│   │       └── lib.rs
│   └── anchor-cli/     # Binary crate
│       └── src/
│           └── main.rs
├── Cargo.toml          # Workspace definition
└── rustfmt.toml        # Formatting config
```

## License

MIT
