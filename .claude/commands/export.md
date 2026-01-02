---
name: export
description: Generate JSON/MDX from JSDoc annotations
agent: sigil-showcasing
agent_path: .claude/skills/sigil-showcasing/SKILL.md
preflight:
  - sigil_mounted
  - component_directory_exists
---

# /sigil export

Export captured component taste to structured data formats for showcase consumption.

## Usage

```
/sigil export
/sigil export --mdx
/sigil export --path src/components
```

## Options

| Option | Description |
|--------|-------------|
| `--mdx` | Also generate MDX documentation files |
| `--path <dir>` | Specify component directory (default: auto-detect) |
| `--output <path>` | Custom JSON output path |

## Output Formats

### JSON (Default)

Generates `sigil-showcase/exports/components.json`:

```json
{
  "components": [
    {
      "name": "ClaimButton",
      "tier": "gold",
      "file": "src/components/ClaimButton.tsx",
      "feel": "Heavy, deliberate",
      "rejected": ["spinner", "skeleton"],
      "inspiration": ["RuneScape skill progress"],
      "intent": "[J] Reduce My Anxiety",
      "owner": "Eileen",
      "physics": "spring: 120, 14"
    }
  ],
  "tiers": {
    "total": 19,
    "gold": 2,
    "silver": 5,
    "uncaptured": 12
  },
  "exportedAt": "2024-03-01T12:00:00Z"
}
```

### MDX (Optional)

With `--mdx` flag, generates one MDX file per component:

```
sigil-showcase/showcase/content/docs/
├── claim-button.mdx
├── joyful-loader.mdx
└── stake-panel.mdx
```

Each MDX file includes:
- Frontmatter with metadata
- Full taste profile
- Production details (Gold only)
- Source file reference

## Prerequisites

- Sigil must be mounted (`/sigil mount`)
- At least one component captured (`/sigil taste`)
- `jq` required for MDX generation (`brew install jq`)

## Examples

```bash
# Export all captured components to JSON
/sigil export

# Export with MDX documentation
/sigil export --mdx

# Export from specific directory
/sigil export --path src/ui/components

# Custom output location
/sigil export --output ./docs/components.json
```

## Output Summary

After export, displays:

```
Export complete!

Summary:
  Total components: 19
  Gold:             2
  Silver:           5
  Uncaptured:       12

Output: sigil-showcase/exports/components.json
```

## Filter Behavior

- **Exported**: Silver and Gold tier components
- **Excluded**: Uncaptured components (no taste data)
- **Excluded**: Non-component files (index.ts, types.ts, utils.ts)

## Integration

Export data can be consumed by:
- Showcase app (Sprint 3)
- Documentation sites (MDX)
- Design tools (JSON)
- CI/CD pipelines

## Error Handling

| Condition | Message |
|-----------|---------|
| Not mounted | "Sigil not mounted. Run /sigil mount first." |
| No components | "No component directory found." |
| No captures | "No captured components. Run /sigil taste first." |
| jq missing | "jq required for MDX. Install with: brew install jq" |
