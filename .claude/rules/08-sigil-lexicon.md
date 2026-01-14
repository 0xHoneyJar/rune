# Sigil: Lexicon

Lookup tables for effect detection, feel adjectives, and material vocabulary.

<effect_keywords>
## Effect Keywords

### Financial (Pessimistic, 800ms, Confirmation)
```
Primary:    claim, deposit, withdraw, transfer, swap, send, pay, purchase
Extended:   mint, burn, stake, unstake, bridge, approve, redeem, harvest
            collect, vest, unlock, liquidate, borrow, lend, repay
Web3:       airdrop, delegate, undelegate, redelegate, bond, unbond
E-commerce: checkout, order, subscribe, upgrade, downgrade, refund
```

### Destructive (Pessimistic, 600ms, Confirmation)
```
Primary:    delete, remove, destroy, revoke, terminate
Extended:   purge, erase, wipe, clear, reset, ban, block, suspend
            deactivate, cancel, void, invalidate, expire, kill
Account:    close account, delete account, remove access, revoke permissions
```

### Soft Delete (Optimistic, 200ms, Toast+Undo)
```
Primary:    archive, hide, trash, dismiss, snooze
Extended:   mute, silence, ignore, skip, defer, postpone
            mark as read, mark as spam, move to folder
Reversible: soft-delete, temporary hide, pause
```

### Standard (Optimistic, 200ms, No Confirmation)
```
Primary:    save, update, edit, create, add, like, follow
Extended:   bookmark, favorite, star, pin, tag, label, comment
            share, repost, quote, reply, mention, react
            submit, post, publish, upload, attach, link
Settings:   change, modify, set, configure, customize, personalize
```

### Local State (Immediate, 100ms)
```
Primary:    toggle, switch, expand, collapse, select, focus
Extended:   show, hide, open, close, reveal, conceal
            check, uncheck, enable, disable, activate
            sort, filter, search, zoom, pan, scroll
Theme:      dark mode, light mode, theme, appearance, display
```

### Navigation (Immediate, 150ms)
```
Primary:    navigate, go, back, forward, link, route
Extended:   visit, open page, view, browse, explore
            next, previous, first, last, jump to
            tab, step, page, section, anchor
```

### Query (Optimistic, 150ms)
```
Primary:    fetch, load, get, list, search, find
Extended:   query, lookup, retrieve, request, poll
            refresh, reload, sync, check status
            preview, peek, inspect, examine
```
</effect_keywords>

<feel_adjectives>
## Feel Adjectives → Physics

### Timing Modifiers
| Adjective | Timing | Easing | Why |
|-----------|--------|--------|-----|
| trustworthy, serious, deliberate | +200ms | ease-out | Weight communicates importance |
| snappy, quick, responsive | -100ms | spring(600,30) | Immediate feedback |
| playful, bouncy, fun | same | spring(400,20) | More bounce, less damping |
| smooth, elegant, refined | same | ease-in-out | Graceful transitions |
| instant, immediate | 0ms | none | No perceived delay |

### Confirmation Modifiers
| Adjective | Effect |
|-----------|--------|
| safe, protected, secure | Add confirmation if not present |
| dangerous, risky, irreversible | Require confirmation |
| casual, quick, lightweight | Remove confirmation if safe |
| undo-able, reversible | Use toast+undo instead of modal |

### Animation Modifiers
| Adjective | Spring | Easing |
|-----------|--------|--------|
| bouncy | stiffness: 300, damping: 15 | — |
| snappy | stiffness: 600, damping: 30 | — |
| smooth | — | ease-in-out, 300ms |
| sharp | — | linear or none |
| elastic | stiffness: 200, damping: 10 | — |
</feel_adjectives>

<material_keywords>
## Material Keywords → Surface

### Surface Types
| Keyword | Shadow | Border | Radius | Backdrop |
|---------|--------|--------|--------|----------|
| flat, minimal | none | optional | 4-8px | none |
| elevated, raised, floating | soft | subtle | 8-12px | none |
| glass, glassmorphism, frosted | lg | white/20 | 12-16px | blur-xl |
| outlined, bordered | none | solid | 4-8px | none |
| neumorphic, soft-ui | inset+outset | none | 12-16px | none |

### Grit/Texture
| Keyword | Treatment |
|---------|-----------|
| clean, polished, modern | No texture, smooth gradients |
| subtle, organic | Slight noise, soft edges |
| retro, vintage, nostalgic | Grain, muted colors, rounded |
| pixel, 8-bit, arcade | Hard edges, 0 radius, chunky borders |
| brutalist, raw | High contrast, sharp, exposed |

### Fidelity
| Keyword | Shadows | Gradients | Effects |
|---------|---------|-----------|---------|
| minimal | 0-1 | 0 | none |
| standard | 1 | 1-2 stops | subtle |
| rich, premium | 2+ | multi-stop | blur, glow |
</material_keywords>

<domain_context>
## Domain Context → Default Physics

### Web3/DeFi
```
Default:        Financial physics (pessimistic)
Assume:         Irreversible, value at stake
Keywords:       wallet, token, NFT, contract, chain, gas
Type hints:     Wei, BigInt, Address, Hash
Always confirm: Any transaction signing
```

### E-commerce
```
Default:        Standard (optimistic) except checkout
Financial:      cart, checkout, payment, order, subscription
Keywords:       product, cart, wishlist, shipping, inventory
Protected:      Payment flow always pessimistic
```

### Social
```
Default:        Standard (optimistic)
Keywords:       post, comment, like, follow, share, feed
Immediate:      Reactions, likes (high frequency)
Standard:       Comments, posts (moderate frequency)
```

### Productivity
```
Default:        Standard (optimistic) with auto-save
Keywords:       document, note, task, project, workspace
Local:          Sorting, filtering, view preferences
Soft delete:    Trash, archive (always undo-able)
```

### Admin/Settings
```
Default:        Standard but with confirmation for sensitive
Destructive:    User management, data deletion, access control
Keywords:       admin, settings, permissions, roles, audit
Always confirm: Anything affecting other users
```
</domain_context>

<type_overrides>
## Type Overrides

Types in props/parameters that force specific physics:

| Type Pattern | Forced Effect | Why |
|--------------|---------------|-----|
| `Currency`, `Money`, `Amount` | Financial | Value transfer |
| `Wei`, `BigInt`, `Token` | Financial | Blockchain value |
| `Balance`, `Price`, `Fee` | Financial | Money display/mutation |
| `Password`, `Secret`, `Key` | Destructive | Security sensitive |
| `Permission`, `Role`, `Access` | Destructive | Access control |
| `Theme`, `Preference`, `Setting` | Local | Client-only |
| `Filter`, `Sort`, `View` | Local | UI state |
</type_overrides>
