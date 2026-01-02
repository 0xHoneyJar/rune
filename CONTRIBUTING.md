# Contributing to Sigil

Thank you for your interest in contributing to Sigil! This document provides guidelines for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Versioning](#versioning)
- [Release Process](#release-process)

## Getting Started

### Prerequisites

- Git
- Claude Code CLI
- Node.js 18+ (for linting)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sigil.git
   cd sigil
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/zksoju/sigil.git
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/description` | `feature/add-color-tokens` |
| Bug fix | `fix/description` | `fix/zone-resolution` |
| Documentation | `docs/description` | `docs/update-process` |
| Refactor | `refactor/description` | `refactor/skill-structure` |

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your branch
git merge upstream/main
```

## Submitting Changes

### Pull Request Process

1. **One PR = One concern**
   - Single feature, bug fix, or documentation update per PR

2. **Write a clear PR description**
   - What does this PR do?
   - Why is this change needed?

3. **Link related issues**
   - Use `Closes #123` or `Fixes #456`

4. **Wait for CI to pass**
   - All automated checks must pass

5. **Request review**
   - At least one maintainer approval required

### Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Longer description if needed.

Closes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(zones): add admin zone motion profile

fix(craft): resolve zone detection for nested paths

docs(readme): update installation instructions
```

## Style Guidelines

### Skills (Commands)

Skills live in `.claude/skills/` using a 3-level architecture:

```
.claude/skills/{skill-name}/
├── index.yaml          # Level 1: Metadata (~100 tokens)
├── SKILL.md            # Level 2: Instructions (~2000 tokens)
└── scripts/            # Level 3: Bash utilities
```

**Naming convention**: Use `sigil-` prefix for Sigil skills:
- `sigil-setup`
- `sigil-envisioning`
- `sigil-codifying`
- `sigil-crafting`
- `sigil-approving`
- `sigil-inheriting`

### Commands

Commands in `.claude/commands/` should:
- Have clear, concise names
- Include pre-flight checks where needed
- Reference the skill they invoke

### Documentation

- Keep explanations concise
- Include code examples
- Update CHANGELOG.md for notable changes

## Versioning

Sigil follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (0.X.0): New features, backward compatible
- **PATCH** (0.0.X): Bug fixes, backward compatible

### Version Files

| File | Purpose |
|------|---------|
| `.sigil-version.json` | Framework version manifest |
| `CHANGELOG.md` | Version history |
| `README.md` | Version badge |

### When to Bump Versions

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Breaking API change | Major | Remove command, change config format |
| New command/feature | Minor | Add `/craft` command |
| Bug fix | Patch | Fix zone resolution |
| Documentation | None | Update README |

## Release Process

### For Maintainers

1. **Prepare Release**
   ```bash
   # Ensure main is up to date
   git checkout main
   git pull origin main

   # Create release branch
   git checkout -b release/vX.Y.Z
   ```

2. **Update Version Files**
   - Update `.sigil-version.json` with new version
   - Update CHANGELOG.md with release notes
   - Ensure version consistency

3. **Create Release PR**
   ```bash
   git add .
   git commit -m "chore: release vX.Y.Z"
   git push origin release/vX.Y.Z
   ```

4. **After PR Merge - Tag Release**
   ```bash
   git checkout main
   git pull origin main
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
   ```

5. **Create GitHub Release**
   - Go to Releases → New Release
   - Select tag `vX.Y.Z`
   - Title: `vX.Y.Z`
   - Copy CHANGELOG entry as description
   - Publish release

### CHANGELOG Format

Follow [Keep a Changelog](https://keepachangelog.com/):

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Why This Release

Brief explanation of the release.

### Added
- New features

### Changed
- Modifications

### Fixed
- Bug fixes

### Breaking Changes
- What breaks (if any)
```

## Types of Contributions

### We Welcome

- Bug fixes and issue reports
- Documentation improvements
- New skill definitions
- Zone system enhancements
- Motion recipe additions
- CI/CD improvements

### Before Large Changes

For significant changes:

1. **Open an issue first** to discuss
2. **Get maintainer feedback**
3. **Consider breaking into smaller PRs**

## Community

### Getting Help

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions

## License

By contributing to Sigil, you agree that your contributions will be licensed under the [MIT License](LICENSE.md).

---

Thank you for contributing to Sigil!
