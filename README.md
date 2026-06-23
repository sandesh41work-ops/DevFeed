# DevFeed

DevFeed is a React Native news reader app built with Expo and TypeScript. It provides authenticated access to Hacker News-style stories, in-app article details, bookmarking, search, and threaded discussion browsing.

---

## Features

- Firebase Authentication with email/password login and signup
- Story feed with search and pagination
- Article detail view with:
  - bookmark toggle
  - share action
  - open article action
- Bookmark list with swipe-to-delete support
- Nested comment discussion viewer
- Dark/light theming handled via custom theme hook
- Offline connection indicator
- React Query for network data management
- Local persistence for bookmarks via AsyncStorage

---

## Tech Stack

- Expo / React Native
- TypeScript
- React Navigation
- Firebase Auth
- React Query
- AsyncStorage
- Expo Vector Icons

---

## Screens

- `Login`
- `Sign Up`
- `Feed`
- `Bookmarks`
- `Article Detail`
- `Discussion`

---

## Getting Started

### Prerequisites

- Node.js
- npm
- Expo CLI
- Xcode or Android Studio if running on simulator/device

### Install

```bash
npm install
```

### Run

```bash
npm start
```

Then choose:
- `npm run android`
- `npm run ios`
- `npm run web`

---

## Firebase

The app uses Firebase Authentication in firebase.ts.

If you want to use your own Firebase project:
- create a Firebase app
- enable Email/Password authentication
- replace the `firebaseConfig` values in firebase.ts

---

## Project Structure

- App.tsx — root entry point
- RootNavigator.tsx — auth + tab navigation
- auth — login/signup screens and auth service
- feed — story feed, article details, query hooks
- bookmarks — saved stories screen
- discussion — threaded comments and discussion UI
- components — UI building blocks
- services — API, bookmark storage, Firebase setup
- hooks — theme and network state hooks
- types — app typings

---

## Notes

- HomeScreen.tsx loads stories in pages and supports pull-to-refresh
- BookmarksScreen.tsx refreshes bookmarks when screen is focused
- StoryDetailsCard.tsx uses bookmark state and `Ionicons` action icons
- SearchBar.tsx includes a clear icon for quick search reset

---

## Future Improvements

- add full offline caching for story data
- improve discussion pagination for large threads
- add profile settings and logout confirmation
- enhance error handling across network requests
- extract environment config for Firebase and API endpoints

---