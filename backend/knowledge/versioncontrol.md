# Version Control - Complete Guide for DevSync

## Table of Contents
1. [Git Fundamentals](#fundamentals)
2. [Configuration](#configuration)
3. [Basic Commands](#commands)
4. [Branching Strategies](#branching)
5. [Merging & Rebasing](#merging)
6. [Collaboration](#collaboration)
7. [Undoing Changes](#undoing)
8. [Stashing](#stashing)
9. [Tags & Releases](#tags)
10. [Best Practices](#practices)
11. [Troubleshooting](#troubleshooting)

## Git Fundamentals {#fundamentals}

Git is a distributed version control system for tracking changes in code.

### Core Concepts

**Repository**: Project folder with .git directory
```
.git/
├── HEAD          # Current branch
├── config        # Repository config
├── objects/      # Compressed file data
└── refs/         # Branch/tag pointers
```

**Three States**
- **Working Directory**: Your local files
- **Staging Area (Index)**: Files ready to commit
- **Repository**: Committed history

**Git Objects**
- **Blob**: File content
- **Tree**: Directory structure
- **Commit**: Snapshot with metadata
- **Tag**: Named reference

## Configuration {#configuration}

### Initial Setup

```bash
# Global configuration
git config --global user.name "John Doe"
git config --global user.email "john@example.com"
git config --global core.editor "vim"
git config --global color.ui true

# Project-specific configuration
git config user.name "Team Lead"  # Local config overrides global

# View configuration
git config --list
git config user.name
```

### .gitconfig Example

```ini
[user]
    name = John Doe
    email = john@example.com

[core]
    editor = vim
    autocrlf = true
    safecrlf = warn

[color]
    ui = true
    branch = auto
    diff = auto
    status = auto

[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD
    last = log -1 HEAD
    visual = log --graph --oneline --all

[pull]
    rebase = true

[push]
    default = current
```

## Basic Commands {#commands}

### Repository Setup

```bash
# Initialize new repository
git init

# Clone existing repository
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git  # SSH

# Clone specific branch
git clone -b develop --single-branch https://github.com/user/repo.git

# Clone with limited history
git clone --depth 1 https://github.com/user/repo.git
```

### Checking Status & History

```bash
# Current status
git status
git status -s  # Short format

# View commit history
git log
git log --oneline               # One line per commit
git log --graph --all --oneline # Visual branch graph
git log -p                      # Show changes
git log --author="John"         # Filter by author
git log --grep="feature"        # Filter by message
git log --since="2 weeks ago"   # Time range
git log main..feature           # Commits in feature, not in main

# View specific commit
git show commit-hash
git show commit-hash:path/to/file.js  # View file at commit

# See who changed each line
git blame path/to/file.js

# View references
git reflog  # History of HEAD changes
```

### Staging & Committing

```bash
# Stage files
git add file.js              # Stage specific file
git add .                    # Stage all changes
git add --interactive        # Interactive staging
git add --patch              # Stage specific hunks

# View staged changes
git diff --staged

# View unstaged changes
git diff

# Commit
git commit -m "feat: add user authentication"
git commit -am "fix: typo"  # Stage + commit tracked files
git commit --amend           # Modify last commit
git commit --amend --no-edit # Add to last commit without editing

# Conventional commit format
# feat:   new feature
# fix:    bug fix
# docs:   documentation
# style:  formatting
# refactor: code restructuring
# perf:   performance improvement
# test:   tests
# chore:  build/dependency updates
```

## Branching Strategies {#branching}

### Git Flow

**Main branches**
- `main`: Production-ready code
- `develop`: Integration branch

**Supporting branches**
- `feature/*`: New features
- `release/*`: Release preparation
- `hotfix/*`: Production fixes

**Workflow**
```bash
# Feature
git checkout -b feature/user-auth develop
# ... work ...
git commit -m "feat: implement user authentication"
git push origin feature/user-auth
# Create pull request, review, merge

# Release
git checkout -b release/1.0.0 develop
# ... update version, fix bugs ...
git commit -m "chore: bump version to 1.0.0"
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git checkout develop
git merge --no-ff release/1.0.0

# Hotfix
git checkout -b hotfix/1.0.1 main
# ... fix critical bug ...
git commit -m "fix: critical security issue"
git checkout main
git merge --no-ff hotfix/1.0.1
git tag v1.0.1
git checkout develop
git merge --no-ff hotfix/1.0.1
```

### GitHub Flow (Simpler)

```bash
# Create feature branch
git checkout -b feature/new-feature main

# Work and commit
git commit -m "feat: implement feature"

# Push to GitHub
git push origin feature/new-feature

# Create pull request on GitHub
# Review and approve

# Merge on GitHub
# Delete branch
git branch -d feature/new-feature
```

## Merging & Rebasing {#merging}

### Merging

```bash
# Merge feature into main
git checkout main
git merge feature/new-feature

# Merge with merge commit (default)
git merge --no-ff feature/new-feature
# Creates merge commit showing history

# Fast-forward merge (default if possible)
git merge feature/new-feature
# If feature is ahead of main, just moves pointer

# Abort merge
git merge --abort
```

### Rebasing

```bash
# Rebase feature onto main (re-apply commits)
git checkout feature/new-feature
git rebase main
# Replays feature commits on top of main

# Interactive rebase (modify commits)
git rebase -i HEAD~3
# Opens editor to squash, reorder, edit commits

# Rebase vs Merge
# Merge: Preserves history, creates merge commit
# Rebase: Linear history, cleaner but rewrites commits
# Never rebase public branches!

# After rebase, force push (dangerous!)
git push -f origin feature/new-feature
```

## Collaboration {#collaboration}

### Remote Management

```bash
# View remotes
git remote -v

# Add remote
git remote add origin https://github.com/user/repo.git

# Rename remote
git remote rename origin upstream

# Remove remote
git remote remove origin

# Change remote URL
git remote set-url origin https://github.com/user/repo.git

# View remote info
git remote show origin
```

### Push & Pull

```bash
# Push branch to remote
git push origin feature/new-feature

# Push all branches
git push origin --all

# Push with tracking
git push -u origin feature/new-feature

# Pull (fetch + merge)
git pull origin main
git pull --rebase      # Fetch + rebase (prefer)

# Fetch (download without merging)
git fetch origin
git fetch upstream

# Update local branch from remote
git pull origin main
```

### Pull Requests / Merge Requests

```bash
# Best practices:
# 1. Create descriptive branch name
git checkout -b feature/user-registration

# 2. Make focused changes
# - Keep commits small and logical
# - One feature per branch

# 3. Push to remote
git push -u origin feature/user-registration

# 4. Create PR/MR with:
# - Descriptive title
# - Clear description
# - Screenshots/demos if UI changes
# - Related issues (#123)

# 5. Address review comments
git commit -m "fix: address review feedback"
git push origin feature/user-registration

# 6. Merge via GitHub/GitLab interface
# - Delete branch after merge
```

## Undoing Changes {#undoing}

### Undo Uncommitted Changes

```bash
# Discard changes in working directory
git checkout -- path/to/file.js
git checkout .  # All files

# Unstage file
git reset HEAD path/to/file.js
git reset       # All files

# Discard staged changes
git reset --hard HEAD
# WARNING: Permanently deletes changes!
```

### Undo Committed Changes

```bash
# Revert commit (creates new commit)
git revert commit-hash
# Safe for public branches

# Reset to previous commit
git reset --soft HEAD~1   # Keep changes staged
git reset --mixed HEAD~1  # Keep changes unstaged (default)
git reset --hard HEAD~1   # Discard changes
# WARNING: Dangerous for public branches!

# Cherry-pick (apply specific commits)
git cherry-pick commit-hash
# Useful for applying specific fixes to multiple branches
```

### Fix Commit History

```bash
# Amend last commit
git commit --amend
git commit --amend --no-edit

# Interactive rebase to fix multiple commits
git rebase -i HEAD~3
# In editor:
# pick = use commit
# reword = use but edit message
# squash = use but combine with previous
# fixup = like squash but discard message
# drop = delete commit

# Rebase example:
# pick 1a2b3c Feat: add login
# squash 2b3c4d Fix: typo in login
# reword 3c4d5e Add validation
```

## Stashing {#stashing}

Save work temporarily without committing.

```bash
# Stash current changes
git stash
git stash save "WIP: feature in progress"

# List stashes
git stash list

# Apply last stash
git stash pop    # Apply and remove
git stash apply  # Apply without removing

# Apply specific stash
git stash apply stash@{1}

# Drop stash
git stash drop stash@{1}
git stash clear  # Delete all stashes

# Stash only unstaged changes
git stash --keep-index

# Stash untracked files too
git stash -u
```

## Tags & Releases {#tags}

### Creating Tags

```bash
# Lightweight tag (just a pointer)
git tag v1.0.0

# Annotated tag (with metadata)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag at specific commit
git tag -a v1.0.0 commit-hash -m "Message"

# Push tags
git push origin v1.0.0      # Specific tag
git push origin --tags      # All tags

# View tag
git show v1.0.0

# Delete tag
git tag -d v1.0.0           # Local
git push origin --delete v1.0.0  # Remote
```

### Semantic Versioning

```
MAJOR.MINOR.PATCH-PRERELEASE+BUILD

v1.2.3-beta.1+build.123

v1 = MAJOR (breaking changes)
v1.2 = MINOR (new features, backward compatible)
v1.2.3 = PATCH (bug fixes)
-beta.1 = Prerelease (alpha, beta, rc)
+build.123 = Build metadata
```

## Best Practices {#practices}

### Commit Hygiene

```bash
# ✅ Good commits
- Atomic (one logical change)
- Well-described message
- Small and focused
- Tested before committing

# ❌ Bad commits
- Large commits with multiple unrelated changes
- Vague messages ("fix", "update")
- Untested code
- Commits that break build
```

### Commit Message Format

```
# Structure
<type>(<scope>): <subject>

<body>

<footer>

# Example
feat(auth): add two-factor authentication

- Implement TOTP algorithm
- Add settings page for 2FA
- Send backup codes via email

Fixes #123
Closes #456
```

### Workflow

```bash
# 1. Create feature branch from develop
git checkout -b feature/awesome-feature develop

# 2. Make focused, atomic commits
git add .
git commit -m "feat: awesome feature implementation"

# 3. Keep branch up to date
git fetch origin
git rebase origin/develop

# 4. Force push if rebased (only on your branch!)
git push -f origin feature/awesome-feature

# 5. Create pull request
# - Link to issues
# - Add description and screenshots
# - Request reviews

# 6. Address feedback
git commit -m "fix: address PR feedback"
git push origin feature/awesome-feature

# 7. Merge (via GitHub/GitLab)
# - Use squash merge for cleaner history
# - Delete branch after merge
```

## Troubleshooting {#troubleshooting}

### Common Issues

**Lost commits**
```bash
# View all commits (even deleted)
git reflog

# Recover deleted commit
git checkout commit-hash

# Create branch from recovered commit
git checkout -b recovered-branch commit-hash
```

**Merge conflicts**
```bash
# View conflicts
git status

# Open conflicted file and resolve manually
# Markers:
# <<<<<<< HEAD (your changes)
# Changes from HEAD
# =======
# Changes from branch
# >>>>>>> branch-name

# After resolving
git add file.js
git commit -m "resolve merge conflict"

# Abort merge if too complex
git merge --abort
```

**Accidentally pushed to wrong branch**
```bash
# Revert commits on main
git revert commit-hash
git push origin main

# Cherry-pick to correct branch
git checkout correct-branch
git cherry-pick commit-hash
git push origin correct-branch
```

**Detached HEAD**
```bash
# Warning: You are in detached HEAD state

# Create branch from current commit
git checkout -b new-branch

# Or go back to main
git checkout main
```

### Useful Git Aliases

```bash
# Add to .gitconfig
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'
git config --global alias.amend 'commit --amend --no-edit'

# Usage
git st
git co -b feature/new-feature
```

---

## Quick Reference

```bash
# Setup
git init
git clone <url>

# Daily workflow
git status
git add .
git commit -m "message"
git push origin branch

# Branches
git branch
git checkout -b feature/new
git checkout main
git merge feature/new

# Undo
git restore file.js
git reset HEAD file.js
git revert commit-hash

# Stash
git stash
git stash pop

# Sync
git fetch origin
git pull origin main
git push origin main
```

**Learn More**: https://git-scm.com/doc