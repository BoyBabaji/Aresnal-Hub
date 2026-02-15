# HarmonyHub – Smart Music Streaming App

HarmonyHub is a cross-platform mobile application concept for Android and iOS focused on music streaming, discovery, and playlist management.

## Project Scope

HarmonyHub enables users to:
- Register and sign in.
- Stream music online.
- Download tracks for offline listening.
- Get personalized recommendations.
- Create and manage playlists.
- Search by artist, album, and genre.
- Access recently played tracks and favorites.
- Share music to social media.
- Upgrade to premium subscriptions.

## Delimitation

The first release does **not** include:
- Music production/editing tools.
- Live concert streaming.
- Podcast creation.
- Full advanced AI recommendation pipelines.

Music availability may vary by region because of licensing constraints.

## MVP Included in This Repository

This repository contains a React Native (Expo) starter app implementing:
- Basic authentication UI (register/login toggle).
- Home dashboard with recommendations, favorites, and recently played sections.
- Search experience with filters and local catalog querying.
- Playlist creation and management.
- Offline download toggle simulation per track.
- Social sharing action simulation.
- Premium plan upsell page.

> Note: Streaming, downloads, AI recommendations, and payments are mocked in this MVP and can be wired to backend services later.

## Running HarmonyHub in VS Code (for testing)

### 1) Install prerequisites
- [Node.js LTS](https://nodejs.org/) (recommended: 18.x or 20.x)
- VS Code
- Expo Go app on your phone (Android/iOS) **or** an Android/iOS simulator

### 2) Open project in VS Code
1. Open VS Code.
2. Click **File → Open Folder...**
3. Select this `Aresnal-Hub` folder.

### 3) Install dependencies
In VS Code terminal (`Terminal → New Terminal`):

```bash
npm install
```

### 4) Start the app

```bash
npm run start
```

This launches Expo DevTools in the terminal.

### 5) Run on a device or simulator
- **On your phone (easiest):**
  - Make sure phone and computer are on the same Wi-Fi.
  - Install and open **Expo Go**.
  - Scan the QR code shown in the terminal.
- **Android emulator:** press `a` in the Expo terminal.
- **iOS simulator (macOS):** press `i` in the Expo terminal.
- **Web preview:**

```bash
npm run web
```

### 6) If something fails
- Clear and restart Expo cache:

```bash
npx expo start -c
```

- If dependencies got corrupted:

```bash
rm -rf node_modules package-lock.json
npm install
```
