# Release Workflow

## Release Notes

When preparing a new GitHub release:

1. Check the latest release in `RELEASES.md`.
2. Find the corresponding Git tag.
3. Compare the latest release tag against the current release candidate:
   `git log <previous-tag>..HEAD`
4. Inspect relevant commits, pull requests and changed files when necessary.
5. Identify user-facing changes.
6. Ignore internal changes that don't affect the product unless they are important.
7. Group changes into:
   - Added
   - Improved
   - Fixed
   - Removed
8. Create concise release notes suitable for a GitHub Release.
9. Update `RELEASES.md` with the new release.
10. Never claim a feature was released unless it exists in the changes being released.

## Release Format

Use:

## vX.Y.Z — YYYY-MM-DD

### Added
- ...

### Improved
- ...

### Fixed
- ...

### Removed
- ...

Keep release notes concise and product-focused.