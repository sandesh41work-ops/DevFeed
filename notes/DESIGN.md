# DevFeed Design System

## Purpose

This document is the source of truth for UI implementation in DevFeed. It describes the actual design tokens, components, and patterns used in the codebase. Future agents should treat the source code as the source of truth and reuse existing patterns before creating new ones.

## Source of Truth

All UI decisions are derived from the actual implementation in `src/`. Key reference points:
- `src/shared/hooks/useTheme.ts` — theme system
- `src/shared/constants/fonts.ts` — font tokens
- `src/shared/components/` — reusable UI primitives
- `src/features/` — screen-level patterns

## Design Principles

- **Dark-first theme system:** Colors are derived from `useTheme()` which returns `isDark` and `colors` tokens.
- **Accent-driven hierarchy:** Orange (`#FF6600`) is the primary accent. It is used for interactive elements, active states, and emphasis. It never changes between light and dark modes.
- **Flat cards with subtle gradients:** Cards do not use heavy shadows. Depth is created through border colors, subtle orange gradients, and pressed opacity.
- **Functional minimalism:** No decorative elements unless they serve a clear UX purpose.

## Theme

### Accessing Theme Values

Every component should consume theme values via the `useTheme` hook:

```ts
const { colors, isDark } = useTheme();
```

**Never hardcode colors.** Always reference `colors.*`.

**Note:** Some existing components contain hardcoded color values (e.g., `#FF6600`, `#E3BFB1`, `#A33E00`, `#ef4444`) that represent technical debt documented in IMPROVEMENTS.md. New code should use `colors.accent`, `colors.border`, and `colors.error` tokens instead of preserving these hardcoded values.

### Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `colors.background` | `#F4F4F4` | `#1a1a1a` | Screen background, container background |
| `colors.card` | `#ffffff` | `#2a2a2a` | Card surfaces, input backgrounds, modal backgrounds |
| `colors.text` | `#222222` | `#ffffff` | Primary text, headings |
| `colors.subtext` | `#555555` | `#aaaaaa` | Secondary text, metadata, placeholders |
| `colors.border` | `#eeeeee` | `#333333` | Borders, dividers, separator lines |
| `colors.accent` | `#FF6600` | `#FF6600` | Brand accent, interactive elements, active states |
| `colors.skeleton` | `#E0E0E0` | `#3a3a3a` | Loading placeholder background |
| `colors.error` | `#B00020` | `#FF6B6B` | Error text, error banners |

### Color Usage Rules

- **Use `colors.accent`** for primary buttons, active chips, interactive icons, and emphasis.
- **Use `colors.card`** for all card surfaces.
- **Use `colors.background`** for screen-level backgrounds.
- **Use `colors.text` / `colors.subtext`** for all text.
- **Use `colors.border`** for all borders and dividers.
- **Never introduce new theme color tokens** without checking if an existing token already fits.

## Typography

### Font Families

```ts
import { fonts } from "../shared/constants/fonts";
// fonts.regular  → IBMPlexSans_400Regular
// fonts.semibold → IBMPlexSans_600SemiBold
// fonts.mono     → IBMPlexMono_600SemiBold
```

**Never hardcode fontFamily strings.** Always use the `fonts` constants.

### Typography Scale

The project does not use a centralized typography scale. Instead, text styles are defined per-component with these recurring values:

| Style | Font Family | Size | Weight | Usage |
|-------|-------------|------|--------|-------|
| Headings / Card titles | `fonts.semibold` | 17–21 | 600–700 | Story card titles, section headers, detail screen titles |
| Body text | `fonts.regular` | 14–16 | 400 | Description text, subtitles, labels |
| Metadata | `fonts.semibold` | 12.5 | 400–500 | Story metadata, timestamps, author names |
| Meta labels (uppercase) | `fonts.regular` | 12 | 700 | Auth screen field labels with `letterSpacing: 1` |
| Buttons | `fonts.semibold` | 15–16 | 600 | Button text |
| Monospace / values | `fonts.mono` | 15 | 600 | Stat values in StoryDetailsCard |
| Badges | `fonts.semibold` | 10–12.5 | 700 | ASK HN badge, author badge |

### Typography Rules

- **Reuse `fonts.*` constants** instead of hardcoded fontFamily strings.
- **Do not create a centralized typography scale** unless all screens adopt it. Documented values above reflect actual usage.
- **Use `fontWeight` inline** only when overriding the default weight of a `fonts.*` family.

## Spacing

### Spacing Helper

The codebase uses a `space` helper function:

```ts
const space = (n: number) => n * 4;
```

Where `n` is the number of 4px units.

### Common Spacing Values

| Value | Pixels | Typical Usage |
|-------|--------|---------------|
| `space(1)` | 4 | Icon-text gap, small padding |
| `space(1.75)` | 7 | Dot separator margin |
| `space(2)` | 8 | Section gaps, input right padding |
| `space(2.5)` | 10 | Header bottom margin |
| `space(3)` | 12 | Card bottom margin, section gap |
| `space(3.5)` | 14 | Button vertical padding (EmptyState) |
| `space(4)` | 16 | Card side margins, screen padding, default section gap |
| `space(4.5)` | 18 | Card border radius |
| `space(5)` | 20 | Card internal padding |
| `space(7)` | 28 | EmptyState/ErrorState button horizontal padding |
| `space(8)` | 32 | EmptyState subtitle bottom margin |

### Spacing Rules

- **Prefer `space(n)`** over raw pixel values for consistency.
- **Note:** Some existing components use hardcoded pixel values (e.g., `padding: 16`, `marginHorizontal: 15`) that represent technical debt documented in IMPROVEMENTS.md. New code should use the `space()` helper for all spacing values.
- **Card horizontal margin** is `space(4)` and vertical margin is `space(3)`.
- **Card internal padding** is `space(5)` horizontally and vertically (StoryCard, AskCard).
- **Screen padding** is typically `16` (hardcoded in detail screens).
- **Input height** is `52` with `paddingHorizontal: 15` and `paddingRight: 45`.
- **Button height** is `52` with `marginTop: 10`.

## Layout

### Screen Pattern

Most screens follow this structure:

```tsx
<View style={{ flex: 1, backgroundColor: colors.background }}>
  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    {/* Content */}
  </ScrollView>
</View>
```

- **Background** should always be `colors.background`.
- **Scrollable screens** should use `contentContainerStyle={{ flexGrow: 1 }}` to ensure proper empty-state centering.
- **List screens** (Home, Bookmarks) use `FlatList` with `ListEmptyComponent` for empty states.

### Safe Area

- `useSafeAreaInsets()` is used in `BookmarksScreen` for bottom padding.
- The `MainTabNavigator` wraps content in a `View` with `paddingTop: insets.top`.
- **Do not hardcode safe-area values.** Use `useSafeAreaInsets` when needed.

### Content Width

- The app uses a fluid width with horizontal margins of `space(4)` in lists.
- `FeedSelector` chips use `paddingHorizontal: 15` for the scroll container.
- `SearchBar` uses `marginHorizontal: 15`.

## Components

### Button (`src/shared/components/Button.tsx`)

Reusable primary button.

```tsx
<Button
  title="Login"
  onPress={handlePress}
  disabled={isDisabled}
  loading={isLoading}
  style={customStyle}
  textStyle={customTextStyle}
/>
```

**Visual:**
- Background: `colors.accent`
- Height: `52`
- Border radius: `12`
- Text color: `#ffffff`
- Font: `fonts.semibold`, size `16`, weight `600`
- Margin top: `10`
- Disabled opacity: `0.6`
- Loading state: `ActivityIndicator` with `#fff` color

**Rules:**
- **Always use the existing `Button` component** for primary actions.
- **Do not create new button styles** for one-off actions. Reuse `Button` with `style` override.
- For destructive actions (e.g., logout in HomeScreen), a red button is used with `backgroundColor: "#ef4444"`.

### Input (`src/shared/components/Input.tsx`)

Reusable text input wrapper.

```tsx
<Input
  placeholder="Search..."
  value={text}
  onChangeText={setText}
  secureTextEntry
  rightElement={<Icon />}
  customStyles={{ marginBottom: 0 }}
/>
```

**Visual:**
- Background: `colors.card`
- Border: `colors.border`, width `1`
- Height: `52`
- Border radius: `12`
- Padding horizontal: `15`, padding right: `45`
- Font: `fonts.regular`, size `16`
- Placeholder color: `colors.subtext`
- Right element: absolutely positioned at `right: 12, top: 13`

**Rules:**
- **Always use the existing `Input` component** instead of raw `TextInput`.
- Use `customStyles` for overrides. Do not create new input wrappers.

### StoryCard (`src/shared/components/StoryCard.tsx`)

Primary feed item for story-type feeds (top, new, best, show, jobs).

**Visual:**
- Pressable with Android ripple `isDark ? "#2A2A2A" : "#ECECEC"`
- Background: `colors.card`
- Border: `colors.border` (hairline), unread left border: `4px solid #e37226e3` (semi-transparent orange)
- Border radius: `space(4.5)` (18px)
- LinearGradient overlay: unread gets `rgba(255,102,0,0.05)` → transparent
- Pressed opacity: `0.85`

**Internal layout:**
- **Header:** Favicon (36x36, radius 10) + domain text (`fonts.semibold`, 12.5px, letterSpacing 0.2) + unread badge (if not visited)
- **Title:** `fonts.semibold`, 17px, lineHeight 23, letterSpacing -0.2. Visited stories use `colors.subtext` and weight `400`.
- **Footer:** metadata dots (`space(1.75)` margin), score, author, time ago, hot flame icon (14px), comment bubble (14px) + count

**Rules:**
- **Do not create a new card style for feed items.** Reuse `StoryCard` or `AskCard`.
- The unread/visited state is managed automatically by the component via `visitedStories` service.
- **Hot threshold** is `score > 500` (`HOT_THRESHOLD`).

### AskCard (`src/shared/components/AskCard.tsx`)

Feed item for Ask HN and Show HN posts.

**Visual:**
- Same card structure as StoryCard.
- Header contains an `ASK HN` badge (orange background, Ionicons `chatbubble-outline`, `fonts.semibold` 10px, letterSpacing 0.7).
- Comment count displayed as a pill badge (radius 999) in the footer.
- No favicon, no domain display.
- No comment preview text (only count is shown; see MISSING_FEATURES.md).

**Rules:**
- **Reuse `AskCard`** for Ask HN posts. It is selected automatically in `HomeScreen` when `selectedFeed === "ask"`.

### StoryDetailsCard (`src/shared/components/StoryDetailsCard.tsx`)

Detail view card for story-type posts.

**Visual:**
- Background: `colors.card`
- Border radius: `18`
- LinearGradient: orange-tinted top-to-bottom
- Title: `fonts.semibold`, 21px, lineHeight 30
- Domain: `fonts.regular`, 14px, marginTop 12
- Stats row: arrow-up icon + points (monospace, 15px), person icon + author + date
- Divider: `colors.border`, hairline height
- "Read Article" button: `#FF6600` background
- Action row: Bookmark/Share buttons with icon + text

**Rules:**
- **Reuse `StoryDetailsCard`** for story detail screens.

### AskDetails (`src/shared/components/AskDetails.tsx`)

Detail view for Ask HN posts.

**Visual:**
- Card with orange gradient header
- ASK HN badge, title, author + time metadata
- Embedded `DiscussionCard` below

**Rules:**
- **Reuse `AskDetails`** for Ask HN detail navigation.

### FeedSelector (`src/shared/components/FeedSelector.tsx`)

Horizontal chip selector for feed types.

```tsx
<FeedSelector selectedFeed={selectedFeed} onFeedChange={setSelectedFeed} />
```

**Visual:**
- Horizontal `ScrollView` with `gap: 7`
- Chips: `paddingHorizontal: 23`, `paddingVertical: 8`, `borderRadius: 999`
- Selected: `backgroundColor: colors.accent`, `borderColor: colors.accent`, text white
- Unselected: `backgroundColor: colors.card`, `borderColor: colors.border`, text `colors.text`
- Pressed: `opacity: 0.8`, `scale: 0.97`
- Text: `fonts.semibold`, 14px, `letterSpacing: 1`, weight `600`

**Rules:**
- **Reuse `FeedSelector`** for any horizontal category/chip selection.
- **Do not duplicate chip styling** for other filters.

### SearchBar (`src/shared/components/SearchBar.tsx`)

Search input wrapper with animated border and clear button.

```tsx
<SearchBar value={query} onChangeText={setQuery} placeholder="Search stories..." />
```

**Visual:**
- Container: `marginVertical: 5`, `marginHorizontal: 15`
- Inner box: `borderRadius: 16`, `backgroundColor: colors.card`, `overflow: "hidden"`
- `AnimatedBorder` wraps the input with `colors.accent` stroke
- Clear button: Ionicons `close-circle`, 28px, pressed color `#e04646`, default `rgba(255,102,0,0.5)`

**Rules:**
- **Reuse `SearchBar`** for search inputs. It composes `Input` + `AnimatedBorder`.

### EmptyState (`src/shared/components/EmptyState.tsx`)

Full-screen empty state with animated keyboard handling.

```tsx
<EmptyState
  image={require("...")}
  title="Nothing saved yet"
  subtitle="Browse stories to fill this list."
  buttonText="Browse"
  onPress={handlePress}
  imageSize={300}
/>
```

**Visual:**
- Container: `flex: 1`, centered, `backgroundColor: colors.background`
- Image: `resizeMode: "contain"`, `width/height: imageSize`
- Title: `fonts.semibold`, 24px, `marginBottom: space(3)`
- Subtitle: `fonts.semibold`, 15px, lineHeight 22, maxWidth 300, `marginBottom: space(8)`
- Button (if provided): `colors.accent`, `paddingHorizontal: space(7)`, `paddingVertical: space(3.5)`, `borderRadius: 16`, `elevation: 2`
- Animated keyboard behavior: translates up `-70` and scales image to `0.6` when keyboard is visible

**Rules:**
- **Reuse `EmptyState`** for any empty list or no-results scenario.
- Use `ListEmptyComponent` in `FlatList` for list empties.
- The default title is "No Results Found!" and subtitle references HN stories.

### ErrorState (`src/shared/components/ErrorState.tsx`)

Full-screen error state with illustration and retry button.

```tsx
<ErrorState refetch={refetch} />
```

**Visual:**
- Container: centered, `backgroundColor: colors.background`
- Image: `require("../../../assets/illustrations/error_state.png")`, max 300px
- Title: `fonts.semibold`, 24px, `marginBottom: space(3)`
- Subtitle: `fonts.semibold`, 15px, lineHeight 22, maxWidth 300, `marginBottom: space(8)`
- Button: uses `Button` component with `backgroundColor: colors.accent`

**Rules:**
- **Reuse `ErrorState`** for fetch/network errors.
- The refetch callback is required.

### Loader (`src/shared/components/Loader.tsx`)

Simple centered `ActivityIndicator`.

**Rules:**
- **Reuse `Loader`** for full-screen loading.
- For inline loading (e.g., comment sections), use `ActivityIndicator` directly with `color={colors.accent}`.

### SummaryCard (`src/shared/components/SummaryCard.tsx`)

Expandable AI summary card with animated chevron.

**Visual:**
- Background: `colors.card`, border: `colors.border`, radius `18`
- `AnimatedBorder` with `colors.accent`
- Header: sparkles icon (accent background `colors.accent + "20"`, 40x40, radius 20) + title + subtitle + animated chevron
- Loading: `ActivityIndicator` + "Generating summary..."
- Error: alert icon (`#EF4444`) + "Failed to generate summary." + retry link
- Success: bullet points with checkmark icons or plain text

**Rules:**
- **Reuse `SummaryCard`** for article summaries.
- Do not duplicate expandable card logic.

### DiscussionCard (`src/features/discussion/Discussion.tsx`)

Expandable discussion container with lazy-loaded comments.

**Visual:**
- Background: `colors.card`, border: `colors.border`, radius `16`
- Header: chatbubbles icon (accent) + title + count + animated chevron
- Expanded: `FadeIn` animation, `LinearTransition` layout
- Loading: centered `ActivityIndicator` with `colors.accent`
- Empty: "No comments yet."
- Load more: `borderRadius: 14`, hairline border, `colors.accent` text
- Child comments use `CommentItem` recursively

**Rules:**
- **Reuse `DiscussionCard`** for all comment sections.
- Do not create alternative comment containers.

### CommentItem (`src/features/discussion/CommentItem.tsx`)

Single comment with avatar, HTML content, and reply toggle.

**Visual:**
- Background: `colors.card`, border: `colors.border`, radius `16`
- Avatar: `colors.accent` circle, 36x36, radius 18, text `fonts.mono`, white, 12px
- Author: `fonts.semibold`, 15px, weight `700`
- Author badge (if applicable): `colors.accent` background, `#fff` text, uppercase, 10px
- Timestamp: `fonts.regular`, 12px, `colors.subtext`
- Content: rendered via `CommentHtml` (`RenderHTML`)
- Footer: reply toggle with Ionicons + `colors.accent` text
- Nested replies: `marginTop: 12`, lighter background (`rgba(255,255,255,0.04)` / `#F8F9FB`), `borderLeft` hairline

**Rules:**
- **Reuse `CommentItem`** for all comment rendering.
- Do not create custom HTML renderers. Use `CommentHtml`.

### CommentHtml (`src/shared/components/Comment.tsx`)

HTML renderer for comment content.

```tsx
<CommentHtml html={comment.text} />
```

**Visual:**
- `body`: `colors.text`, 14px, lineHeight 22
- `p`: `colors.text`, marginVertical 4
- `a`: `colors.accent`

**Rules:**
- **Always use `CommentHtml`** for comment text. Do not pass raw HTML to `Text`.

### FavIcon (`src/shared/components/FavIcon.tsx`)

Favicon loader with Google favicon API.

```tsx
<Favicon url={story.url} />
```

**Visual:**
- Container: 36x36, marginRight 12
- Image: `https://www.google.com/s2/favicons?domain=${url}&sz=64`, radius 10
- Fallback: Ionicons `globe-outline`, 18px, `#6B7280`
- Shadow: subtle (`shadowOpacity: 0.08`, `shadowRadius: 2`, elevation 1)

**Rules:**
- **Reuse `FavIcon`** for all story domain icons.

### AppHeader (`src/shared/components/AppHeader.tsx`)

Top app header with logo and profile button.

**Visual:**
- Height: `64`
- Padding horizontal: `20`
- Border bottom: `1px solid #E3BFB1` (hardcoded, not theme-aware)
- Left: `MaterialCommunityIcons console-line` (24px, `colors.text`) + "DevFeed" (`fonts.semibold`, 24px, weight `700`, `#A33E00`)
- Right: Ionicons `person-outline` (22px) in a 40x40 touchable

**Rules:**
- **Reuse `AppHeader`** for the main app header. It is placed above the tab navigator in `MainTabNavigator`.

### UserManagementModal (`src/shared/components/UserMangementModal.tsx`)

Bottom sheet modal for user profile management.

**Visual:**
- Backdrop: `rgba(0,0,0,0.35)`
- Sheet: bottom-aligned, `maxHeight: height * 0.85`, radius 24
- Drag handle: 40x5, radius 3, `colors.border`
- Avatar placeholder: 72x72, radius 36, `colors.background`
- Name: `fonts.semibold`, 20px, weight `700`
- Email: `fonts.regular`, 15px, `colors.subtext`
- Divider: `colors.border`, hairline
- Input: border `colors.border`, bg `colors.background`, radius 12
- Save button: `colors.accent`, height 48, radius 12
- Logout: Ionicons `log-out-outline`, 22px, `colors.accent`

**Rules:**
- **Reuse `UserManagementModal`** for user profile interactions.
- Do not create alternative modal sheets.

### AnimatedBorder (`src/shared/components/AnimatedBorder.tsx`)

Animated SVG border with gradient stroke.

```tsx
<AnimatedBorder color={colors.accent} borderRadius={16} />
```

**Visual:**
- SVG rect with animated `strokeDashoffset`
- Segment length: `Math.min(80, Math.max(40, perimeter * 0.12))`
- Animation duration: `2800ms`, linear easing, infinite repeat
- Base stroke: `0.15` opacity
- Animated stroke: full opacity, rounded caps

**Rules:**
- **Reuse `AnimatedBorder`** for accent-bordered cards (SearchBar, SummaryCard).

### ShimmerBone (`src/shared/components/ShimmerBone.tsx`)

Animated shimmer placeholder.

```tsx
<ShimmerBone width={110} height={12} borderRadius={4} />
```

**Visual:**
- Background: `colors.skeleton`
- Shimmer: `LinearGradient` from `transparent` → `rgba(255,102,0,0.08)` → `transparent`
- Animation: `translateX` from `-SCREEN_WIDTH` to `SCREEN_WIDTH`, duration `2000ms`, loop

**Rules:**
- **Reuse `ShimmerBone`** for skeleton UIs.
- Combine in `SkeletonCard` for card-level skeletons.

### SkeletonCard (`src/shared/components/SkeletonCard.tsx`)

Card-shaped skeleton loader.

**Visual:**
- Matches `StoryCard` margins and internal layout
- ShimmerBones for favicon (16x16), domain (110x12), title lines, footer metadata

**Rules:**
- **Reuse `SkeletonCard`** for loading states in lists.

### Footer (`src/shared/components/Footer.tsx`)

Infinite-scroll loading footer.

**Visual:**
- Two `SkeletonCard` instances
- `FadeIn` / `FadeOut` with `LinearTransition.springify()`

**Rules:**
- **Reuse `Footer`** as `ListFooterComponent` in FlatList.

### SwipeableStoryCard (`src/shared/components/SwipeableStoryCard.tsx`)

Swipeable wrapper for `StoryCard` with delete action.

**Visual:**
- Right action: red (`#ef4444`) background, Ionicons `trash`, 20px, white text "Delete"
- Width: `100`, radius `12`, marginRight `12`

**Rules:**
- **Reuse `SwipeableStoryCard`** only for bookmark deletion. Do not create generic swipeable wrappers.

## Navigation

### Structure

- **Stack Navigator:** `RootNavigator` with `NativeStackNavigator`
- **Tabs:** `BottomTabNavigator` inside `MainTabs` stack screen
- **Auth flow:** `SignUp` and `Login` screens shown when user is `null`
- **Main flow:** `MainTabs` (Feed + Bookmarks), `ArticleDetail`, `AskDetail`, `ArticleWebView`

### Navigation Theme

```ts
const navigationTheme = {
  ...(isDark ? DarkTheme : DefaultTheme),
  colors: {
    ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};
```

**Rules:**
- **Always derive the navigation theme from `isDark` and `colors`** as shown above.
- **Do not hardcode navigation colors.**

### Tab Bar

- Background: `colors.background`
- Height: `70`, `paddingBottom: 8`, `paddingTop: 8`
- Active tint: `colors.text`
- Inactive tint: `colors.subtext`
- Icons: Ionicons (filled for active, outlined for inactive)

### Headers

- Stack headers use `colors.background` and `colors.text`/`colors.subtext`.
- `headerBackButtonDisplayMode: "minimal"` for detail screens.
- `AppHeader` is rendered manually above the tab navigator, not as a navigation header.

## Icons

### Library

- **Primary:** `Ionicons` from `@expo/vector-icons`
- **Secondary:** `MaterialCommunityIcons` from `@expo/vector-icons`

### Common Icon Sizes

| Context | Size |
|---------|------|
| Story card metadata | 14 |
| Comment action icons | 14 |
| Header icons | 22–24 |
| Input right elements | 20 |
| Search clear button | 28 |
| Favicon | 36 (container), 18 (fallback) |

### Icon Color Rules

- **Use `colors.accent`** for interactive/active icons.
- **Use `colors.text`** for neutral icons.
- **Use `colors.subtext`** for inactive/muted icons.
- **Never hardcode icon colors** unless the color is a fixed brand color (e.g., Google blue `#EA4335`, Apple black `#000`, error red `#EF4444`).

## Borders, Radius, and Elevation

### Border Radius

| Component | Radius |
|-----------|--------|
| Cards (StoryCard, AskCard, SkeletonCard) | `space(4.5)` = 18px |
| Detail cards (StoryDetailsCard, AskDetails, DiscussionCard) | `18` |
| Inputs | `12` |
| Buttons | `12` |
| SearchBar box | `16` |
| Chips | `999` (pill) |
| EmptyState/ErrorState buttons | `16` |
| Swipeable delete button | `12` |
| Modal sheet | `24` (top corners only) |
| Favicon | `10` |
| Avatar | `18` |
| Author badge | `4` |

### Border Widths

- Standard borders use `StyleSheet.hairlineWidth`.
- Chips use explicit `borderWidth: 1`.

### Elevation and Shadows

- **Cards do not use shadows.** Depth comes from border colors and gradients.
- **Elevation is used sparingly:**
  - `EmptyState` / `ErrorState` buttons: `elevation: 2`
  - `UserManagementModal`: `elevation: 24`
  - `FavIcon`: `elevation: 1`
- **Android ripple** is the primary press feedback for `Pressable`.

## Gradients

Gradients are used for subtle orange accent overlays, not as primary backgrounds.

```tsx
<LinearGradient
  colors={["rgba(255,102,0,0.05)", "rgba(255,102,0,0)"]}
  start={{ x: 0.5, y: 0 }}
  end={{ x: 0.5, y: 1 }}
  style={styles.gradient}
/>
```

**Rules:**
- **Only use orange gradients** (`rgba(255,102,0,...)`) for card accents.
- **Do not create colorful gradients** unless explicitly requested.
- Gradients should always be top-to-bottom (`y: 0` → `y: 1`).

## Images and Assets

### Illustrations

Located in `assets/illustrations/`:
- `loginCat.png` — Login screen hero
- `signUpCat.png` — SignUp screen hero
- `error_state.png` — Error state illustration
- `no_results_light.png` — Empty state (light)
- `no-bookmarks.png` — Bookmarks empty state

**Rules:**
- **Store static illustrations in `assets/illustrations/`.**
- **Use `resizeMode: "cover"` for hero images** and `resizeMode: "contain"` for empty/error states.

### Favicons

- Loaded from `https://www.google.com/s2/favicons?domain=${url}&sz=64`.
- **Always use the `FavIcon` component.** Do not fetch favicons manually.

## Interaction and States

### Press Feedback

| Component | Press Behavior |
|-----------|---------------|
| `Pressable` cards | `opacity: pressed ? 0.85 : 1` + Android ripple |
| `Pressable` chips | `opacity: pressed ? 0.8 : 1`, `scale: pressed ? 0.97 : 1` |
| `Pressable` buttons | `opacity: pressed ? 0.9 : 1` |
| `TouchableOpacity` | `activeOpacity: 0.85` (default) |

### Loading States

- **Full screen:** `Loader` or centered `ActivityIndicator` with `color={colors.accent}`.
- **Cards:** `SkeletonCard` (used in `HomeScreen` initial load and `Footer`).
- **Buttons:** `loading` prop shows `ActivityIndicator` with `#fff` color.
- **Inputs:** No built-in loading state. Use field-level indicators if needed.

### Error States

- **Full screen:** `ErrorState` with illustration and retry button.
- **Inline:** Colored `Text` below inputs using `colors.error`.
- **Banner:** Colored `View` with `colors.error + "1A"` background and `colors.error` text.

### Empty States

- **List empty:** `ListEmptyComponent` with `EmptyState`.
- **No results:** Same `EmptyState` component with search-appropriate copy.

### Haptic and Animation

- **Haptics:** Not used in the current codebase.
- **Animations:** `react-native-reanimated` is used for layout transitions, chevron rotation, fade in/out, and shimmer. `expo-linear-gradient` is used for static gradient overlays and shimmer effects.

## Authentication UI

### LoginScreen (`src/features/auth/LoginScreen.tsx`)

- Hero image, subtitle, form fields, social buttons.
- Uses `Input` and `Button` components.
- Error banners: `colors.error + "1A"` background.
- Info banners: `colors.accent + "1A"` background, `colors.accent + "33"` border.
- Social buttons: `colors.card` bg, `colors.border` border, height 54, radius 30.

### SignUpScreen (`src/features/auth/SignUpScreen.tsx`)

- Same layout as LoginScreen with additional password confirmation, strength meter, and terms checkbox.
- Password strength: 4 segments, colors `#FF4444` / `#FFA500` / `#4CAF50` based on score.
- Checkbox: 20x20, radius 4, accent color when checked.

## Reuse Rules

When implementing a new UI element, follow this priority:

1. **Existing reusable component** — `Button`, `Input`, `StoryCard`, `AskCard`, `SearchBar`, `EmptyState`, `ErrorState`, `SummaryCard`, `DiscussionCard`, `CommentItem`, `FavIcon`, `FeedSelector`, `Loader`, `ShimmerBone`, `SkeletonCard`, `Footer`, `SwipeableStoryCard`, `UserManagementModal`, `AnimatedBorder`, `CommentHtml`
2. **Existing theme token** — `colors.*`, `fonts.*`, `space()`
3. **Existing screen/component pattern** — Match the layout and styling of the closest existing screen
4. **Existing styling convention** — Match spacing, radius, and interaction patterns from neighboring components
5. **Create new style/value** — Only when genuinely necessary and no existing pattern fits

## AI Implementation Rules

- **Consume `useTheme()`** in every component that renders colors.
- **Use `fonts.*`** for all font families.
- **Use `space(n)`** for spacing. Avoid raw pixel values like `padding: 13` or `marginTop: 17`.
- **Use `StyleSheet.hairlineWidth`** for borders and dividers.
- **Use `Pressable`** with `android_ripple` for cards and chips. Use `TouchableOpacity` for simpler actions.
- **Use existing components** instead of creating new ones. If you think a new component is needed, verify there isn't an existing one that can be extended.
- **Use `LinearGradient`** only for orange accent overlays, not for backgrounds.
- **Use `AnimatedBorder`** for animated accent borders.
- **Use `Ionicons`** and `MaterialCommunityIcons` from `@expo/vector-icons`. Do not install new icon libraries.
- **Use `RenderHTML`** via `CommentHtml` for rich text. Do not parse HTML manually.

## Anti-Patterns

- **Do not hardcode colors** when a theme token exists.
- **Do not create new color tokens** without verifying the existing `colors` object does not cover the need.
- **Do not introduce a new spacing scale.** Use `space(n)`.
- **Do not use arbitrary padding/margin values** like `padding: 13` or `gap: 11`.
- **Do not create duplicate button/card/input styles.** Reuse existing components.
- **Do not introduce another typography system.** Use `fonts.*` constants.
- **Do not introduce another icon library.** Use `@expo/vector-icons`.
- **Do not create a new theme provider.** Use `useTheme()`.
- **Do not create new modals or bottom sheets.** Use `UserManagementModal` or native `Modal` with the established backdrop style (`rgba(0,0,0,0.35)`).
- **Do not copy styles from unrelated screens** without understanding their purpose.
- **Do not redesign existing components** unless explicitly requested.
- **Do not replace established patterns** with generic UI conventions (e.g., do not swap cards for generic list items).
- **Do not use hardcoded light/dark colors** when the theme system already provides them.
- **Do not create one-off visual patterns** merely because they look good in isolation.
