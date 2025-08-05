# Git Workflow

## Branch Strategy

### Main Branches
- **main** - Production-ready code where releases are published
- **develop** - Integration branch for experimental or major features

### Feature Branches
- **feature|bugfix|hotfix|docs|refactor/*** - Individual branches for specific changes

## Workflow Process

### Standard Feature Development
1. Create feature branch from `main`
2. Develop and test changes
3. Submit pull request to `main`
4. After review and approval, merge to `main`
5. Publish release from `main`
6. Sync changes back to `develop`

### Experimental Features
1. Create feature branch from `develop`
2. Develop and test changes
3. Submit pull request to `develop`
4. When stable and ready for release, merge `develop` to `main`
5. Publish release from `main`

## Release Strategy

Each merge to `main` represents a releasable version following semantic versioning.