# Sigil Moodboarding Skill

> *"Before the components, define the kingdom's soul."*

## Purpose

Create and manage product and feature moodboards that define the overarching "taste" of a product. Moodboards capture north stars, core feelings, and anti-patterns that guide component taste capture.

---

## Commands

### Create Product Moodboard
```
/sigil moodboard
/sigil moodboard product
```

Launches product moodboard interview and creates `sigil-showcase/moodboards/product.md`.

### Create Feature Moodboard
```
/sigil moodboard [feature-name]
```

Launches feature moodboard interview and creates `sigil-showcase/moodboards/features/{feature-name}.md`.

### List Moodboards
```
/sigil moodboard --list
```

Shows all existing moodboards with status.

---

## Product Moodboard Interview

### Pre-flight Check

```bash
# Verify sigil is mounted
if [[ ! -f ".sigil-version.json" ]]; then
  echo "ERROR: Sigil not mounted. Run /sigil mount first."
  exit 1
fi

# Check if product moodboard exists
if [[ -f "sigil-showcase/moodboards/product.md" ]]; then
  echo "Product moodboard already exists."
  echo "Edit: sigil-showcase/moodboards/product.md"
  echo "Or delete to recreate."
  exit 0
fi
```

### Interview Questions

Use AskUserQuestion for each:

#### Question 1: North Stars
```
What games or products inspire this product's feel?

Think about:
- Games with the right progression feel
- Products with the right aesthetic
- Experiences that evoke the emotions you want

Examples: "RuneScape for progression, Linear for clean UI, Stardew for peaceful"
```

Options:
- Games focus (list games)
- Products focus (list products)
- Mixed (both)
- I'll fill this in later

#### Question 2: Core Feelings by Context
```
How should key moments feel?

| Context | Feel |
|---------|------|
| Transactions | [Heavy/Light, Fast/Deliberate, etc.] |
| Success | [Triumphant/Subtle, Earned/Given, etc.] |
| Loading | [Anticipatory/Invisible, etc.] |
| Errors | [Recoverable/Final, Blame-user/Sympathetic] |
```

Options:
- High-stakes (heavy, deliberate, ceremonial)
- Light & fast (quick, invisible, efficient)
- Playful (bouncy, fun, forgiving)
- Mixed by context (I'll specify)

#### Question 3: Anti-Patterns
```
What patterns should this product NEVER use?

Examples:
- "No generic spinners"
- "No skeleton screens"
- "No instant success toasts"
- "No punishing error messages"
```

Options:
- Standard anti-patterns (spinners, skeletons, fast toasts)
- Minimal anti-patterns (only explicit violations)
- Custom list (I'll specify)

#### Question 4: Reference Collection
```
Do you have reference images to add?

These will go in sigil-showcase/moodboards/assets/
Supported: PNG, JPG, GIF, WebP

You can add later by placing files in the assets directory.
```

Options:
- No references yet
- I'll add files manually
- I have URLs to capture

---

## Feature Moodboard Interview

### Pre-flight Check

```bash
# Verify product moodboard exists
if [[ ! -f "sigil-showcase/moodboards/product.md" ]]; then
  echo "WARNING: No product moodboard found."
  echo "Consider creating one first: /sigil moodboard product"
fi

FEATURE_NAME="$1"
FEATURE_FILE="sigil-showcase/moodboards/features/${FEATURE_NAME}.md"

if [[ -f "$FEATURE_FILE" ]]; then
  echo "Feature moodboard already exists: $FEATURE_FILE"
  exit 0
fi
```

### Interview Questions

#### Question 1: Feature Purpose
```
What does the {feature} feature do?

Describe the core purpose and user journey.
```

Free text response.

#### Question 2: Emotional Goal
```
What should users feel during/after using {feature}?

Examples:
- "Confident that their transaction succeeded"
- "Delighted by unexpected discovery"
- "Safe even when making mistakes"
```

Options:
- Confident/Assured
- Delighted/Surprised
- Safe/Protected
- Accomplished/Proud
- Custom feeling

#### Question 3: Feel Profile
```
Define the primary feel for {feature}:

This should be specific and reference-able.
Example: "Heavy and deliberate, like a RuneScape level-up"
```

Free text response.

#### Question 4: Components Involved
```
What components are involved in this feature?

List the key UI components that make up this feature.
Example: ClaimButton, ProgressBar, SuccessModal
```

Free text response (comma-separated).

---

## Template Processing

### Create from Template

```bash
TEMPLATE="$SIGIL_HOME/templates/moodboards/product.md.template"
OUTPUT="sigil-showcase/moodboards/product.md"

# Replace placeholders
sed -e "s/{{PRODUCT_NAME}}/$PRODUCT_NAME/g" \
    -e "s/{{DATE}}/$(date +%Y-%m-%d)/g" \
    -e "s/{{USER}}/$USER/g" \
    "$TEMPLATE" > "$OUTPUT"
```

### Inject Interview Responses

After template creation, inject interview responses into appropriate sections:

1. Parse existing file
2. Find section markers (## North Stars, ## Core Feelings, etc.)
3. Inject content after markers
4. Preserve existing content if present

---

## Asset Management

### Directory Structure

```
sigil-showcase/moodboards/
├── assets/
│   ├── screenshots/      # App screenshots
│   ├── inspirations/     # Reference images
│   ├── anti-patterns/    # What not to do
│   └── features/
│       └── {feature}/    # Feature-specific assets
```

### Git LFS Setup

```bash
# Check if LFS is initialized
if ! git lfs env &> /dev/null; then
  echo "Git LFS not initialized. Running setup..."
  git lfs install
fi

# Track asset types
cd sigil-showcase/moodboards
git lfs track "assets/**/*.png" "assets/**/*.jpg" "assets/**/*.gif"
```

---

## Output Formats

### Moodboard JSON Export

For showcase consumption, moodboards can be exported to JSON:

```bash
./scripts/export-moodboard.sh product > sigil-showcase/exports/moodboard.json
```

JSON schema:
```json
{
  "product": "ProductName",
  "northStars": {
    "games": ["RuneScape", "Diablo"],
    "products": ["Linear", "Notion"]
  },
  "coreFeels": {
    "transactions": "Heavy, deliberate",
    "success": "Triumphant, earned",
    "loading": "Anticipatory, not anxious",
    "errors": "Recoverable, not punishing"
  },
  "antiPatterns": [
    "Generic loading spinners",
    "Skeleton screens"
  ],
  "features": [
    {
      "name": "transactions",
      "file": "features/transactions.md"
    }
  ]
}
```

---

## Agent Behavior

When user runs `/sigil moodboard`:

1. **Pre-flight**: Check mount status, existing moodboard
2. **Detect Type**: Product vs feature based on argument
3. **Interview**: Run appropriate interview flow
4. **Generate**: Create moodboard from template + responses
5. **Assets**: Set up assets directory if needed
6. **Report**: Show created file and next steps

### Success Message

```
✓ Product moodboard created!

File: sigil-showcase/moodboards/product.md

North Stars:
  - Games: RuneScape, Diablo
  - Products: Linear, Notion

Core Feelings captured for 4 contexts.

Next steps:
  1. Add reference images to assets/
  2. Create feature moodboards: /sigil moodboard transactions
  3. Start capturing component taste: /sigil taste ClaimButton
```

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "Sigil not mounted" | No .sigil-version.json | Run /sigil mount |
| "Moodboard exists" | File already created | Edit existing or delete to recreate |
| "Template not found" | Missing template file | Check Sigil installation |
| "Git LFS not available" | LFS not installed | Install with `brew install git-lfs` |

---

## Integration with Taste Capture

Moodboards inform component taste capture:

1. When `/sigil taste` runs, it can reference moodboard feels
2. `@moodboard` tag links component to feature moodboard
3. Physics defaults can be derived from moodboard feel profile

Example flow:
```
/sigil moodboard              → Creates product.md
/sigil moodboard transactions → Creates features/transactions.md
/sigil taste ClaimButton      → References transactions moodboard
```

---

## Scripts

### export-moodboard.sh

Exports moodboard to JSON for showcase consumption:

```bash
./scripts/export-moodboard.sh [product|feature-name] [output-file]
```

### list-moodboards.sh

Lists all moodboards with metadata:

```bash
./scripts/list-moodboards.sh
```

Output:
```
Product Moodboard:
  - sigil-showcase/moodboards/product.md (2024-01-15)

Feature Moodboards:
  - transactions (active) - 2024-01-16
  - onboarding (draft) - 2024-01-17
```
