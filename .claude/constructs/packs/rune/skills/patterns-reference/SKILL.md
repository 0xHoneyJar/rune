---
name: patterns-reference
description: Golden implementation patterns for each effect type
user-invocable: false
invoked-by:
  - crafting (L4)
---

# Patterns Reference

Reference implementations for each effect type. Adapt to match codebase conventions.

## Financial: ClaimButton

**Physics:** Pessimistic, 800ms, confirmation required

```tsx
function ClaimButton({ amount, onSuccess }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate, isPending } = useMutation({
    mutationFn: () => claimRewards(amount),
    onSuccess: () => { setShowConfirm(false); onSuccess?.() },
    // NO onMutate - pessimistic means no optimistic updates
  })

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="min-h-[44px]"
      >
        Claim {formatAmount(amount)}
      </button>
    )
  }

  return (
    <div>
      <p>Claim {formatAmount(amount)}?</p>
      <button onClick={() => setShowConfirm(false)}>Cancel</button>
      <button
        onClick={() => mutate()}
        disabled={isPending}
        className="min-h-[44px]"
      >
        {isPending ? 'Claiming...' : 'Confirm'}
      </button>
    </div>
  )
}
```

**Correct because:**
- Two-phase confirmation
- Cancel always visible
- No `onMutate` (pessimistic)
- Disabled during pending
- Touch targets ≥44px

## Destructive: DeleteButton

**Physics:** Pessimistic, 600ms, confirmation required

```tsx
function DeleteButton({ itemId, itemName, onDeleted }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteItem(itemId),
    onSuccess: () => { setShowConfirm(false); onDeleted?.() },
  })

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="min-h-[44px] text-red-600"
      >
        Delete
      </button>
    )
  }

  return (
    <div className="p-4 border border-red-200 rounded">
      <p>Delete "{itemName}"? This cannot be undone.</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setShowConfirm(false)}
          className="min-h-[44px]"
        >
          Cancel
        </button>
        <button
          onClick={() => mutate()}
          disabled={isPending}
          className="min-h-[44px] bg-red-600 text-white"
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
```

**Correct because:**
- Clear description of what's deleted
- Explicit "cannot be undone" warning
- Cancel visible throughout
- Red color signals danger

## Standard: LikeButton

**Physics:** Optimistic, 200ms, no confirmation

```tsx
function LikeButton({ postId, isLiked }) {
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: () => toggleLike(postId),
    onMutate: async () => {
      await queryClient.cancelQueries(['post', postId])
      const previous = queryClient.getQueryData(['post', postId])
      queryClient.setQueryData(['post', postId], old => ({
        ...old, isLiked: !old.isLiked
      }))
      return { previous }
    },
    onError: (_, __, ctx) => {
      queryClient.setQueryData(['post', postId], ctx?.previous)
    },
  })

  return (
    <button
      onClick={() => mutate()}
      className="min-h-[44px]"
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {isLiked ? '❤️' : '🤍'}
    </button>
  )
}
```

**Correct because:**
- `onMutate` for instant feedback
- `onError` for rollback
- No loading state shown (optimistic)
- Accessible label

## Soft Delete: ArchiveButton

**Physics:** Optimistic, 200ms, toast + undo

```tsx
function ArchiveButton({ itemId, onArchived }) {
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: () => archiveItem(itemId),
    onMutate: async () => {
      // Optimistic remove from list
      await queryClient.cancelQueries(['items'])
      const previous = queryClient.getQueryData(['items'])
      queryClient.setQueryData(['items'], old =>
        old.filter(item => item.id !== itemId)
      )
      return { previous }
    },
    onSuccess: () => {
      toast({
        title: 'Item archived',
        action: (
          <button onClick={() => unarchiveItem(itemId)}>
            Undo
          </button>
        ),
        duration: 5000,
      })
      onArchived?.()
    },
    onError: (_, __, ctx) => {
      queryClient.setQueryData(['items'], ctx?.previous)
      toast.error('Failed to archive')
    },
  })

  return (
    <button
      onClick={() => mutate()}
      className="min-h-[44px]"
    >
      Archive
    </button>
  )
}
```

**Correct because:**
- Optimistic update
- Toast with undo option
- 5s undo window
- Rollback on error

## Local: ThemeToggle

**Physics:** Immediate, 100ms, no confirmation

```tsx
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="min-h-[44px]"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}
```

**Correct because:**
- No server call
- Instant response
- Accessible label
- Local state only

## Token Budget

~700 tokens when loaded.
