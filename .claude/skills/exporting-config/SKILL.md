# Exporting Config Skill (v4.0)

## Purpose

Build-time export of design context for runtime use. Transforms YAML files into optimized JSON/TypeScript for application consumption.

## Philosophy (v4.0)

> "Sweat the art. We handle the mechanics. Return to flow."

Build-time export bridges agent-time context and runtime code:
- Agent has full YAML access during development
- Runtime gets optimized, typed configuration
- No YAML parsing at runtime
- Type-safe access in TypeScript

---

## CLI Command (v4.0-S8-T1)

### Basic Usage

```bash
# Export to default location
sigil export-config

# Export to specific path
sigil export-config --output dist/sigil.config.json

# Minified for production
sigil export-config --minify

# With TypeScript types
sigil export-config --typescript
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--output <path>` | Output file path | `sigil-mark/runtime/sigil.config.json` |
| `--minify` | Minify JSON output | false |
| `--typescript` | Generate TypeScript types | false |
| `--watch` | Watch for changes | false |

---

## Config Builder (v4.0-S8-T2)

### Input Files

```
sigil-mark/
├── personas/personas.yaml    → personas[]
├── vocabulary.yaml           → vocabulary{}
├── philosophy.yaml           → philosophy{}
└── .sigilrc.yaml             → zones[]
```

### Output Structure

```typescript
interface SigilConfig {
  version: "4.0.0";
  generated: string;  // ISO timestamp

  personas: RuntimePersona[];
  zones: RuntimeZone[];
  vocabulary: Record<string, VocabularyTerm>;
  philosophy: PhilosophyConfig;
}
```

---

## Runtime Personas (v4.0-S8-T3)

### Source (YAML)

```yaml
# sigil-mark/personas/personas.yaml
personas:
  - name: depositor
    trust_level: high
    default_lens: power_user
    source: analytics
    evidence:
      - id: EV-2026-001
        summary: "Mixpanel data shows 80% deposit completion"
    journey_stages:
      - discovery
      - onboarding
      - active
    characteristics:
      patience: low
      technical_skill: high
    preferences:
      motion: deliberate
      density: high
```

### Output (JSON)

```json
{
  "personas": [
    {
      "name": "depositor",
      "trust_level": "high",
      "default_lens": "power_user",
      "journey_stages": ["discovery", "onboarding", "active"],
      "characteristics": {
        "patience": "low",
        "technical_skill": "high"
      },
      "preferences": {
        "motion": "deliberate",
        "density": "high"
      }
    }
  ]
}
```

### Excluded Fields

| Field | Reason |
|-------|--------|
| `source` | Agent-only (evidence origin) |
| `evidence[]` | Agent-only (evidence references) |
| `last_refined` | Agent-only (metadata) |

---

## Runtime Zones (v4.0-S8-T4)

### Source (YAML)

```yaml
# .sigilrc.yaml
zones:
  critical:
    paths:
      - "src/features/claim/**"
      - "src/features/deposit/**"
    journey_stage: active
    persona_likely: depositor
    trust_state: critical
    motion: deliberate
    evidence:
      - id: EV-2026-002
```

### Output (JSON)

```json
{
  "zones": [
    {
      "name": "critical",
      "layout": "CriticalZone",
      "journey_stage": "active",
      "persona_likely": "depositor",
      "trust_state": "critical",
      "motion": "deliberate"
    }
  ]
}
```

### Excluded Fields

| Field | Reason |
|-------|--------|
| `paths[]` | Agent-only (file matching) |
| `evidence[]` | Agent-only (evidence references) |

---

## Watch Mode (v4.0-S8-T5)

### Usage

```bash
sigil export-config --watch
```

### Watched Files

```
sigil-mark/personas/personas.yaml
sigil-mark/vocabulary.yaml
sigil-mark/philosophy.yaml
.sigilrc.yaml
```

### Behavior

```
[Sigil] Watching for changes...
[Sigil] personas.yaml changed → regenerating...
[Sigil] Config exported to sigil-mark/runtime/sigil.config.json
```

---

## React Provider (v4.0-S8-T6)

### Optional Output

```bash
sigil export-config --typescript --provider
```

### Generated Files

```
sigil-mark/runtime/
├── sigil.config.json      # Runtime config
├── sigil.config.ts        # TypeScript types
└── SigilProvider.tsx      # React context (optional)
```

### Provider Usage

```tsx
import { SigilProvider, usePersona, useZone } from './sigil-mark/runtime/SigilProvider';
import config from './sigil-mark/runtime/sigil.config.json';

function App() {
  return (
    <SigilProvider config={config}>
      <MyComponent />
    </SigilProvider>
  );
}

function MyComponent() {
  const persona = usePersona('depositor');
  const zone = useZone('critical');

  return (
    <div data-motion={zone.motion}>
      {/* Uses persona preferences */}
    </div>
  );
}
```

### TypeScript Types

```typescript
// sigil.config.ts
export interface RuntimePersona {
  name: string;
  trust_level: 'low' | 'medium' | 'high';
  default_lens: string;
  journey_stages: string[];
  characteristics: Record<string, string>;
  preferences: {
    motion?: 'instant' | 'snappy' | 'deliberate' | 'playful';
    density?: 'low' | 'medium' | 'high';
  };
}

export interface RuntimeZone {
  name: string;
  layout: string;
  journey_stage?: string;
  persona_likely?: string;
  trust_state?: 'building' | 'established' | 'critical';
  motion?: 'instant' | 'snappy' | 'deliberate' | 'playful';
}

export interface SigilConfig {
  version: string;
  generated: string;
  personas: RuntimePersona[];
  zones: RuntimeZone[];
  vocabulary: Record<string, { definition: string; context?: string }>;
  philosophy: {
    principles: Array<{ id: string; summary: string }>;
    rules: Array<{ id: string; summary: string }>;
  };
}
```

---

## Documentation (v4.0-S8-T7)

### CI/CD Integration

```yaml
# .github/workflows/build.yml
jobs:
  build:
    steps:
      - name: Export Sigil Config
        run: npx sigil export-config --minify --output dist/sigil.config.json

      - name: Build App
        run: npm run build
```

### Package.json Scripts

```json
{
  "scripts": {
    "sigil:export": "sigil export-config",
    "sigil:watch": "sigil export-config --watch",
    "prebuild": "npm run sigil:export"
  }
}
```

### Runtime Import

```typescript
// Direct import (bundled)
import config from './sigil-mark/runtime/sigil.config.json';

// Dynamic import (code-split)
const config = await import('./sigil-mark/runtime/sigil.config.json');

// Fetch (for remote config)
const config = await fetch('/sigil.config.json').then(r => r.json());
```

---

## Workflow

### Phase 1: Read Sources

```
1. Read sigil-mark/personas/personas.yaml
2. Read sigil-mark/vocabulary.yaml
3. Read sigil-mark/philosophy.yaml
4. Read .sigilrc.yaml
```

### Phase 2: Transform

```
1. Filter personas to runtime fields
2. Filter zones to runtime fields
3. Flatten vocabulary for lookup
4. Extract philosophy summaries
```

### Phase 3: Output

```
1. Generate JSON config
2. Optionally generate TypeScript types
3. Optionally generate React Provider
4. Write to output path
```

---

## Error Handling

| Situation | Response |
|-----------|----------|
| No Sigil setup | "Sigil not initialized. Run /envision first." |
| Invalid YAML | Show parse error with line number |
| Missing required field | Show field name and file |
| Output path not writable | Show permission error |
| Watch mode file deleted | Re-scan and warn |

---

## Output Example

### Full Config (Pretty)

```json
{
  "version": "4.0.0",
  "generated": "2026-01-07T14:30:00Z",
  "personas": [
    {
      "name": "depositor",
      "trust_level": "high",
      "default_lens": "power_user",
      "journey_stages": ["discovery", "onboarding", "active"],
      "characteristics": {
        "patience": "low",
        "technical_skill": "high"
      },
      "preferences": {
        "motion": "deliberate",
        "density": "high"
      }
    }
  ],
  "zones": [
    {
      "name": "critical",
      "layout": "CriticalZone",
      "journey_stage": "active",
      "persona_likely": "depositor",
      "trust_state": "critical",
      "motion": "deliberate"
    }
  ],
  "vocabulary": {
    "depositor": {
      "definition": "A user who deposits funds into the protocol",
      "context": "Always use 'depositor' not 'user' in critical zones"
    }
  },
  "philosophy": {
    "principles": [
      {
        "id": "P1",
        "summary": "Make the right path easy"
      }
    ],
    "rules": [
      {
        "id": "R1",
        "summary": "Critical actions require deliberate motion"
      }
    ]
  }
}
```

### Minified Config

```json
{"version":"4.0.0","generated":"2026-01-07T14:30:00Z","personas":[{"name":"depositor","trust_level":"high","default_lens":"power_user","journey_stages":["discovery","onboarding","active"],"characteristics":{"patience":"low","technical_skill":"high"},"preferences":{"motion":"deliberate","density":"high"}}],"zones":[{"name":"critical","layout":"CriticalZone","journey_stage":"active","persona_likely":"depositor","trust_state":"critical","motion":"deliberate"}],"vocabulary":{"depositor":{"definition":"A user who deposits funds into the protocol","context":"Always use 'depositor' not 'user' in critical zones"}},"philosophy":{"principles":[{"id":"P1","summary":"Make the right path easy"}],"rules":[{"id":"R1","summary":"Critical actions require deliberate motion"}]}}
```

---

## Philosophy

1. **Agent-time vs Runtime** — Full context for agent, optimized for runtime
2. **Type Safety** — TypeScript types for compile-time checks
3. **Build Integration** — Works with existing build tools
4. **Watch for DX** — Fast feedback during development
5. **No Runtime Parsing** — Pre-compiled JSON, no YAML at runtime
