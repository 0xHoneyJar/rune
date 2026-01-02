# Sigil Showcase

> *"See the guild's finest work."*

A Next.js application for browsing and exploring component taste captured by Sigil.

## Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the showcase.

## Structure

```
showcase-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── showcase/           # Component browser
│       ├── page.tsx        # Component grid
│       └── [name]/         # Component detail
│           └── page.tsx
├── components/             # UI components
│   ├── TierBadge.tsx       # Gold/Silver/Uncaptured badge
│   ├── IntentBadge.tsx     # JTBD intent label
│   ├── ComponentCard.tsx   # Component preview card
│   └── Playground.tsx      # Interactive preview
├── lib/                    # Utilities
│   ├── components.ts       # Component registry
│   └── types.ts            # TypeScript definitions
└── public/                 # Static assets
```

## Data Flow

1. Run `/sigil export` in your product repo to generate `components.json`
2. Copy or symlink `sigil-showcase/exports/components.json` to this app
3. The showcase reads and displays all captured components

```bash
# Sync exports from product repo
pnpm export
```

## Features

### Component Browser

- Filter by tier (Gold, Silver, All)
- Filter by JTBD intent
- Search by component name
- Sort by name or capture date

### Component Detail

- Full taste profile display
- Rejected patterns with rationale
- Inspiration references
- Physics parameters (Gold only)
- Live component preview (if available)

### Live Playground

For components that can be rendered:
- Interactive state controls
- Props manipulation
- Physics visualization
- Code snippet display

## Customization

### Adding Product Components

To enable live preview of your product's components:

1. Export components from your product
2. Create wrapper components in `components/previews/`
3. Register in `lib/component-previews.ts`

### Styling

Tailwind CSS is configured with Sigil-specific colors:
- `gold-*` - Gold tier accent
- `silver-*` - Silver tier accent

Modify `tailwind.config.ts` to match your product's design system.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm export` | Sync component exports |
| `pnpm lint` | Run ESLint |

## Integration with Sigil

This showcase is designed to work with the Sigil framework:

```bash
# In product repo
/sigil mount              # Install Sigil
/sigil taste              # Capture component taste
/sigil export             # Generate JSON exports
/sigil showcase           # Launch this app
```

## License

MIT
