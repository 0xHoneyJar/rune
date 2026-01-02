# Sigil Showcasing Skill

> *"See the guild's finest work."*

## Purpose

Export captured component taste to JSON and MDX formats for showcase consumption. Enables external tools and documentation sites to display taste data.

---

## Commands

### Export to JSON
```
/sigil export
```

Generates `sigil-showcase/exports/components.json` from JSDoc annotations.

### Export with MDX
```
/sigil export --mdx
```

Generates both JSON and MDX documentation files.

---

## Export Workflow

### Step 1: Pre-flight Check

```bash
# Verify sigil is mounted
if [[ ! -f ".sigil-version.json" ]]; then
  echo "ERROR: Sigil not mounted. Run /sigil mount first."
  exit 1
fi

# Detect component directory
if [[ -d "src/components" ]]; then
  COMPONENT_DIR="src/components"
elif [[ -d "components" ]]; then
  COMPONENT_DIR="components"
else
  echo "ERROR: No component directory found."
  exit 1
fi
```

### Step 2: Scan Components

```bash
# Find all component files
find "$COMPONENT_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" -o -name "*.vue" -o -name "*.svelte" \)
```

### Step 3: Parse JSDoc

For each component file:
```bash
./scripts/export-components.sh src/components sigil-showcase/exports/components.json
```

### Step 4: Generate MDX (Optional)

```bash
./scripts/generate-mdx.sh sigil-showcase/exports/components.json sigil-showcase/showcase/content/docs/
```

---

## Scripts

### export-components.sh

Main export script that scans components and generates JSON:

```bash
./scripts/export-components.sh [src-path] [output-path]
```

**Arguments**:
- `src-path`: Component directory (default: `src/components`)
- `output-path`: JSON output path (default: `sigil-showcase/exports/components.json`)

**Output**:
- `components.json` with all captured taste data
- Console summary with tier counts

### generate-mdx.sh

Generates MDX documentation from exported JSON:

```bash
./scripts/generate-mdx.sh [input-json] [output-dir]
```

**Arguments**:
- `input-json`: Path to components.json (default: `sigil-showcase/exports/components.json`)
- `output-dir`: MDX output directory (default: `sigil-showcase/showcase/content/docs/`)

**Requirements**:
- `jq` for JSON parsing (`brew install jq`)

---

## Export Schema

```json
{
  "components": [
    {
      "name": "ClaimButton",
      "tier": "gold",
      "file": "src/components/ClaimButton.tsx",
      "description": "Users rage-clicked due to subtle loading feedback",
      "feel": "Heavy, deliberate",
      "rejected": ["spinner", "skeleton"],
      "inspiration": ["RuneScape skill progress", "Diablo loot drop"],
      "intent": "[J] Reduce My Anxiety",
      "owner": "Eileen",
      "physics": "spring: 120, 14; delay: 200ms",
      "capturedAt": "2024-01-15",
      "graduatedAt": "2024-02-01"
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

### Field Mapping

| JSDoc Tag | JSON Field | Required |
|-----------|------------|----------|
| @description | description | Silver |
| @feel | feel | Silver |
| @rejected | rejected | Silver |
| @inspiration | inspiration | Silver |
| @intent | intent | Silver |
| @tier | tier | Auto-detected |
| @owner | owner | Gold only |
| @physics | physics | Gold only |
| @capturedAt | capturedAt | Optional |
| @graduatedAt | graduatedAt | Gold only |

---

## MDX Template

Generated MDX files include:

```mdx
---
title: "ComponentName"
tier: "gold"
feel: "Heavy, deliberate"
intent: "[J] Reduce My Anxiety"
capturedAt: "2024-01-15"
---

# ComponentName

<TierBadge tier="gold" />

## Problem Solved

[Description from JSDoc]

## Taste Profile

### Feel
> Heavy, deliberate

### Rejected Patterns
- spinner
- skeleton

### Inspiration
- RuneScape skill progress
- Diablo loot drop

## Intent

<IntentBadge intent="[J] Reduce My Anxiety" />

## Production Details (Gold only)

### Taste Owner
Eileen

### Physics Parameters
```ts
spring: 120, 14
delay: 200ms
```

## Source
```
src/components/ClaimButton.tsx
```
```

---

## Output Structure

```
sigil-showcase/
├── exports/
│   └── components.json       # Exported taste data
└── showcase/
    └── content/
        └── docs/
            ├── claim-button.mdx
            ├── joyful-loader.mdx
            └── stake-panel.mdx
```

---

## Agent Behavior

When user runs `/sigil export`:

1. **Validate**: Check sigil mounted, components exist
2. **Scan**: Find all component files
3. **Parse**: Extract JSDoc from each file
4. **Filter**: Only include Silver and Gold tiers
5. **Generate**: Write components.json
6. **Report**: Show tier summary

When `--mdx` flag is provided:

7. **Check jq**: Verify jq is installed
8. **Generate**: Create MDX file per component
9. **Report**: Show generated file count

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Sigil not mounted" | No .sigil-version.json | Run /sigil mount |
| "No component directory" | Can't find components | Specify path |
| "No captured components" | All uncaptured | Run /sigil taste first |
| "jq not installed" | MDX generation fails | Install jq |

---

## Integration

Export is the bridge between taste capture and showcase display:

```
/sigil taste → JSDoc → /sigil export → JSON → Showcase App
                                      → MDX → Documentation
```

The showcase app consumes these exports for live rendering.

---

## Showcase Commands

### Launch Showcase
```
/sigil showcase
```

Starts the Next.js development server at http://localhost:3000.

### Initialize Showcase
```
/sigil showcase --init
```

Copies the showcase template to `sigil-showcase/showcase/`.

### Build for Production
```
/sigil showcase --build
```

Builds static files for deployment.

---

## Showcase Scripts

### launch-showcase.sh

Main launch script for the showcase app:

```bash
./scripts/launch-showcase.sh [--build] [--init] [--port N]
```

**Arguments**:
- `--build`: Build for production
- `--init`: Initialize from template
- `--port N`: Use specific port

**Requirements**:
- Node.js 18+
- pnpm or npm

---

## Showcase App Structure

```
templates/showcase-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── showcase/           # Component browser
│       ├── page.tsx        # Grid view
│       └── [name]/         # Detail view
│           └── page.tsx
├── components/             # UI components
│   ├── TierBadge.tsx       # Gold/Silver badge
│   ├── IntentBadge.tsx     # JTBD label
│   ├── ComponentCard.tsx   # Preview card
│   ├── ComponentFilter.tsx # Filter controls
│   └── Playground.tsx      # Live preview
├── lib/                    # Utilities
│   ├── components.ts       # Registry functions
│   └── types.ts            # TypeScript types
└── public/
    └── components.json     # Symlink to exports
```

---

## Component Registry

The registry (`lib/components.ts`) provides:

| Function | Description |
|----------|-------------|
| `getComponents()` | All exported components |
| `getComponentByName(name)` | Single lookup |
| `getGoldComponents()` | Gold tier only |
| `getSilverComponents()` | Silver tier only |
| `getComponentsByIntent(intent)` | Filter by JTBD |
| `getComponentsByFeel(feel)` | Filter by feel |
| `searchComponents(query)` | Text search |
| `filterComponents(filter)` | Multi-criteria filter |
| `getTierStats()` | Tier counts |
| `getUniqueIntents()` | All intent labels |

---

## Live Playground

The playground component (`components/Playground.tsx`) provides:

- **State Switcher**: Default, Hover, Loading, Success, Error
- **Physics Display**: Stiffness/damping for Gold components
- **Framer Motion Integration**: Spring animations
- **Interactive Preview**: Responsive to state changes

Physics are parsed from the `@physics` tag:
```
@physics spring: 120, 14
```

Becomes:
```typescript
{ stiffness: 120, damping: 14 }
```

---

## Agent Behavior

When user runs `/sigil showcase`:

1. **Validate**: Check Node.js version, sigil mounted
2. **Initialize**: If --init, copy template
3. **Symlink**: Ensure components.json linked
4. **Install**: Run npm/pnpm install if needed
5. **Launch**: Start dev server or build

---

## Showcase Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Node.js required" | Node not installed | Install from nodejs.org |
| "Node.js 18+ required" | Old version | Update Node.js |
| "Showcase not found" | Not initialized | Run --init |
| "No exports found" | Missing JSON | Run /sigil export |
| "Port in use" | 3000 occupied | Use --port N |
