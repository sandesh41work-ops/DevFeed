# DevFeed Missing Features

## Critical (P0)

- **No comment previews on Ask HN posts in feed** — AskCard shows comment count pill but no preview text/excerpt from top comments; users must navigate to AskDetails to read any comment content.
- **No HN comment nesting depth limit handling** — Deep threads can cause performance issues; no max-depth truncation or virtualization.
- **No offline mode** — AsyncStorage is used for bookmarks/visited, but stories/comments are never cached for offline reading.
- **No push notifications** — No notification system for comment replies or story updates.
- **No share on StoryCard and AskCard** — `Share.share` exists in StoryDetailsCard but is not exposed on StoryCard or AskCard (P2 priority, see IMPROVEMENTS.md).
- **No settings screen** — No user preferences for feeds, notifications, or display options.
- **No about screen** — No app version, credits, or changelog view.
- **No HN account integration** — No upvote, reply, submit, or profile features; app is read-only.
- **No user profile beyond name** — Only display name is stored; no avatar, karma, or HN profile view.

## High (P1)

- **No story sorting in detail view** — ArticleDetail and AskDetail show fixed layouts with no sort options.
- **No pagination indicators** — Infinite scroll has no visual indicator of page position or total count.
- **No "load more" UX in comments** — Basic "Load more comments" button exists but lacks progress indication or skeleton loading.
- **No dark mode toggle** — Theme is system-only; no manual override in settings.
- **No font size settings** — No accessibility options for text scaling.
- **No text scaling** — Font sizes are hardcoded per component; no global scaling factor.

## Medium (P2)

- **No swipe actions on feed** — SwipeableStoryCard only exists for Bookmarks deletion; feed items have no swipe actions.
- **No long-press actions** — No context menus on StoryCard/AskCard for quick actions.
- **No context menus** — No native context menus on any list items.
- **No image viewer for linked content** — WebView has no image preview or gallery mode.
- **No in-app browser customization** — WebView lacks custom UI chrome (share button, open externally, reading progress).
- **No reading progress** — No scroll position tracking in WebView or ArticleDetail.
- **No "mark all as read"** — No batch action to clear unread states across the feed.
- **No swipe between tabs** — Feed and Bookmarks tabs only support tap navigation.
- **No pull-to-refresh on Home** — Refresh is only implemented on Bookmarks screen.
