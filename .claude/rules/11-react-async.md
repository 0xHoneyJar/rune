# Sigil: React Async Patterns

**Impact:** CRITICAL — Waterfalls are the #1 performance killer. Each sequential await adds full network latency.

<async_api_routes>
## Prevent Waterfall Chains in API Routes

In API routes and Server Actions, start independent operations immediately.

**Incorrect (config waits for auth, data waits for both):**

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

**Correct (auth and config start immediately):**

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id)
  ])
  return Response.json({ data, config })
}
```
</async_api_routes>

<async_defer_await>
## Defer Await Until Needed

Move `await` operations into branches where they're actually used.

**Incorrect (blocks both branches):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)

  if (skipProcessing) {
    return { skipped: true }  // Still waited for userData
  }

  return processUserData(userData)
}
```

**Correct (only blocks when needed):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    return { skipped: true }  // Returns immediately
  }

  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

**Early return optimization:**

```typescript
// Correct: fetches only when needed
async function updateResource(resourceId: string, userId: string) {
  const resource = await getResource(resourceId)

  if (!resource) {
    return { error: 'Not found' }
  }

  const permissions = await fetchPermissions(userId)

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}
```
</async_defer_await>

<async_dependencies>
## Dependency-Based Parallelization

For operations with partial dependencies, use `better-all` to maximize parallelism.

**Incorrect (profile waits for config unnecessarily):**

```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

**Correct (config and profile run in parallel):**

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
```

Reference: [better-all](https://github.com/shuding/better-all)
</async_dependencies>

<async_parallel>
## Promise.all() for Independent Operations

When async operations have no interdependencies, execute them concurrently.

**Incorrect (sequential execution, 3 round trips):**

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**Correct (parallel execution, 1 round trip):**

```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```
</async_parallel>

<async_suspense_boundaries>
## Strategic Suspense Boundaries

Use Suspense boundaries to show wrapper UI faster while data loads.

**Incorrect (wrapper blocked by data fetching):**

```tsx
async function Page() {
  const data = await fetchData()  // Blocks entire page

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <DataDisplay data={data} />
      <div>Footer</div>
    </div>
  )
}
```

**Correct (wrapper shows immediately, data streams in):**

```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData()
  return <div>{data.content}</div>
}
```

**When NOT to use:**
- Critical data needed for layout decisions (affects positioning)
- SEO-critical content above the fold
- Small, fast queries where Suspense overhead isn't worth it
- When you want to avoid layout shift

**Sigil integration:** For pessimistic sync (financial, destructive), Suspense provides deliberate loading states without blocking the escape hatch (cancel button).
</async_suspense_boundaries>
