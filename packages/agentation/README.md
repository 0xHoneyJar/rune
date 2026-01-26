# @thehoneyjar/agentation

Visual UI feedback toolbar for AI coding agents. Address mocking and element annotation.

## Installation

```bash
npm install @thehoneyjar/agentation
# or
pnpm add @thehoneyjar/agentation
```

## Quick Start

```tsx
import { AgentationProvider, Agentation } from '@thehoneyjar/agentation'

function App() {
  return (
    <AgentationProvider>
      <YourApp />
      <Agentation />
    </AgentationProvider>
  )
}
```

That's it! Press `Ctrl+Shift+D` to toggle the toolbar.

## Features

### Address Impersonation (Lens)
Mock any wallet address for testing without connecting a real wallet.

```tsx
import { useEffectiveAddress } from '@thehoneyjar/agentation'

function MyComponent() {
  const address = useEffectiveAddress()
  // Returns impersonated address if lens active, otherwise undefined
}
```

### Element Inspector
Annotate UI elements and export to markdown for AI coding agents.

```tsx
import { useElementInspector, useAnnotationSession } from '@thehoneyjar/agentation'

function ReviewMode() {
  const { startInspecting, hoveredElement } = useElementInspector()
  const { annotations, exportToMarkdown } = useAnnotationSession()

  // Click elements to annotate, then copy markdown
}
```

## wagmi Integration

For wagmi users, import from the `/wagmi` subpath:

```tsx
import { useLensAwareAccount } from '@thehoneyjar/agentation/wagmi'

function WalletInfo() {
  const { address, realAddress, isImpersonating } = useLensAwareAccount()

  // `address` respects impersonation (use for reads)
  // `realAddress` is always the real wallet (use for signing)
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+D` | Toggle toolbar |
| `1` | Switch to Lens tab |
| `2` | Switch to Inspector tab |
| `Esc` | Close toolbar |

## Configuration

```tsx
<AgentationProvider config={{
  position: 'bottom-right',  // or 'bottom-left', 'top-right', 'top-left'
  shortcuts: true,           // Enable keyboard shortcuts
  defaultTab: 'lens',        // Default tab when opening
}}>
```

## API Reference

### Components
- `Agentation` - Main component (trigger + toolbar)
- `Trigger` - Floating button only
- `Toolbar` - Panel only
- `LensPanel` - Address impersonation panel
- `InspectorPanel` - Element annotation panel

### Lens Hooks
- `useLens()` - Full lens state
- `useEffectiveAddress()` - Impersonated or real address
- `useIsImpersonating()` - Boolean check
- `useSavedAddresses()` - Saved addresses with actions

### Inspector Hooks
- `useElementInspector()` - Element inspection
- `useAnnotationSession()` - Annotation management

## Bundle Size

| Bundle | Gzipped |
|--------|---------|
| Main | ~9 KB |
| wagmi | <1 KB |

## License

MIT
