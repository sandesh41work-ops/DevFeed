# DevFeed Improvements

## High Impact (P0)

### Features
- **In-app HN actions** — Upvote, reply, and submit posts via HN account integration.
- **Offline-first caching** — Cache fetched stories and comments locally for offline reading.
- **Push notifications** — Notify on comment replies and story updates.
- **In-app image viewer** — Preview linked images with custom UI chrome (share, open externally).
- **Comment search/filter** — Find specific comments or filter by author in long threads.

### Navigation & UX
- **Swipe between tabs** — Enable gesture-based tab switching on Feed/Bookmarks.
- **Mark all as read** — Batch clear unread states and left-border indicators.
- **Hide read stories toggle** — Filter feed to show only unread items.
- **Default feed preference** — Let users choose which feed opens on launch.
- **Pull-to-refresh on Home** — Currently only available on Bookmarks screen.

---

## Medium Impact (P1)

### Reading Experience
- **Font size / text scaling** — Accessibility toggle (small/medium/large) that scales `fontSize` across the app.
- **Compact / dense view** — Tighter spacing mode for power users wanting more stories per screen.
- **Reading progress** — Track scroll position in WebView and ArticleDetail to show progress indicator.
- **Better search** — Move beyond client-side title filtering. Add author/domain search and search history.

### Comments & Discussion
- **Thread virtualization** — Switch nested comment rendering to virtualized list for deep-thread performance.
- **Comment collapsing** — Collapse/expand individual comments, not just whole sections.
- **Inline reply composer** — Reply to HN comments directly in-app.

### Polish
- **Haptic feedback** — Add light haptics on card presses, tab switches, and bookmark toggles.
- **Skeleton for AskDetails** — Missing loading skeleton; mirror `SkeletonCard` pattern.
- **Skeleton for comments** — Add `ShimmerBone`-based comment skeletons while loading.
- **Optimistic UI** — Update UI immediately on bookmark/visited actions before storage confirms.

---

## Low Impact (P2)

### Quick Wins
- **Dark mode toggle** — Manual override in settings; currently system-only.
- **Share story intent** — Expose `Share.share` on `StoryCard` (already wired in `StoryDetailsCard`).
- **Long-press context menu** — Preview, share, bookmark, or hide from feed.
- **Swipe-to-delete on Feed** — Reuse `SwipeableStoryCard` pattern for temporary hide.
- **Trending / Hot section** — Split hot stories (`score > 500`) into a dedicated tab or section.
- **About / changelog screen** — Show app version, credits, and recent updates from `notes/RELEASES.md`.

---

## Technical Debt & Bugs

### Confirmed Bugs
- **Favicon fallback logic** — `FavIcon.tsx` uses `loading && error`, which is impossible. Should be `loading || error` or separate states.
- **Inconsistent spacing** — `ArticleDetailScreen.tsx` uses hardcoded `padding: 16` instead of `space(n)`.
- **Unused styles** — `ArticleDetailScreen.tsx` defines `styles.card`, `styles.title`, `styles.author`, `styles.date`, `styles.statsRow`, `styles.statCard`, `styles.statValue`, `styles.typeText`, `styles.buttonRow`, `styles.actionButton`, `styles.gradient` that are never used.

### Hardcoded Values (Should Be Theme Tokens)
- **AppHeader border** — `borderBottomColor: "#E3BFB1"` should use `colors.border` or a theme token.
- **AppHeader title** — `color: "#A33E00"` should use `colors.accent` or a theme token.
- **StoryDetailsCard read button** — `backgroundColor: "#FF6600"` should use `colors.accent`.
- **StoryDetailsCard bookmark color** — `"#EF4444"` should be moved to `colors.error` or a dedicated token.
- **HomeScreen logout button** — `backgroundColor: "#ef4444"` should use theme error color.
- **HomeScreen network banner** — `backgroundColor: "#dc2626"` should use `colors.error`.
- **SwipeableStoryCard delete button** — `backgroundColor: "#ef4444"` and text `"#fff"` should use theme tokens.
- **CommentItem avatar text** — `color: "#fff"` should use theme-aware color.
- **SummaryCard error color** — `"#EF4444"` should use `colors.error`.
- **SearchBar clear button** — `"#e04646"` and `"rgba(255,102,0,0.5)"` should use theme tokens.

### Architecture & Maintainability
- **No error boundaries** — Add React error boundary for graceful crash recovery app-wide.
- **Magic numbers** — `HOT_THRESHOLD = 500` in `StoryCard.tsx` should be a configurable constant.
- **Comment HTML rendering** — `Comment.tsx` lacks styles for `pre`, `code`, `blockquote`, and lists. Add `tagsStyles` for these elements.
- **Duplicate time-ago logic** — `getTimeAgo` is copied in `StoryCard.tsx`, `AskCard.tsx`, `AskDetails.tsx`, and `CommentItem.tsx`. Extract to a shared utility.
- **Duplicate gradient definitions** — Card gradient overlays are copy-pasted across components. Extract to a reusable helper or higher-order component.
- **No TypeScript strictness on navigation params** — `useRoute<any>()` and `useNavigation<any>()` are used throughout. Replace with typed navigators.
- **Async storage error handling** — `bookmarkService.ts` and `visitedStories.ts` lack try/catch for JSON parse and storage operations.
