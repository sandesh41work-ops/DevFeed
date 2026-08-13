# DevFeed Release Notes

## v1.2.1 — 2026-08-13

### Added
- Integrated `expo-observe` for interaction tracking and dashboard visibility across Login, SignUp, Home, ArticleDetail, ArticleWebView, and Bookmarks screens.
- Added `expo-splash-screen` plugin for improved app startup experience.
- Added `expo-insights` for development metrics reporting.

### Improved
- Updated Expo SDK from `56.0.15` to `56.0.19`.
- Updated `react-native-screens` from `4.25.2` to `4.26.0`.
- Reformatted `App.tsx` for consistency.

### Fixed
- Removed unnecessary React fragment wrapper in `HomeScreen`.
- Fixed extra whitespace and formatting issues in `BookmarksScreen` and `ArticleWebViewScreen`.

### Removed
- None.

## v1.2.0 — 2026-08-11

### Added
- Introduced a dedicated Ask HN experience with a separate card style in the feed.
- Added a new Ask detail screen so Ask posts have their own focused view.

### Improved
- Refined discussion and comment layouts with clearer hierarchy, spacing, and visual polish.
- Improved empty states so comment threads now show clearer feedback when there is no content yet.

### Fixed
- Tightened navigation typing for Ask details to improve reliability and reduce type-safety issues.

### Removed
- None.
