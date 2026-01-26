# Glyph: Golden Patterns

Reference implementations. Adapt to match codebase conventions.

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
      <button onClick={() => setShowConfirm(true)}>
        Claim {formatAmount(amount)}
      </button>
    )
  }

  return (
    <div>
      <p>Claim {formatAmount(amount)}?</p>
      <button onClick={() => setShowConfirm(false)}>Cancel</button>
      <button onClick={() => mutate()} disabled={isPending}>
        {isPending ? 'Claiming...' : 'Confirm'}
      </button>
    </div>
  )
}
```

**Correct because:** Two-phase confirmation, cancel always visible, no `onMutate`, disabled during pending.

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
    <button onClick={() => mutate()}>
      {isLiked ? '❤️' : '🤍'}
    </button>
  )
}
```

**Correct because:** `onMutate` for instant feedback, `onError` for rollback, no loading state shown.

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
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}
```

**Correct because:** No server call, instant response, accessible label.
