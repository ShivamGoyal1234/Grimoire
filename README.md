# The Grimoire

**One sentence:** A dark, fantasy-themed **React Native (Expo)** mobile app that browses Harry Potter universe data from the public **Potter DB** JSON:API—categories, searchable lists, rich detail screens, book chapters, and optional looping theme audio.

---

## What judges should verify

| Check | Detail |
|--------|--------|
| **Platform** | Expo SDK **54**, React Native **0.81**, React **19** |
| **Language** | TypeScript |
| **Data** | Remote only: `https://api.potterdb.com` (no API key) |
| **Networking** | Device or emulator must have internet access |
| **Entry** | `index.ts` → `App.tsx` → `src/navigation/RootNavigator.tsx` |

---

## Features (functional)

- **Splash** — Animated intro; navigates into the archive flow.
- **Categories** — Entry hub: **Books** (featured), plus grid for **Characters**, **Movies**, **Potions**, **Spells**.
- **List** — Paginated lists (25 items per page), **debounced search**, infinite-style loading when more pages exist.
- **Detail** — Type-specific layouts: e.g. character / potion / spell / movie / generic archive; book detail includes **chapter list** when the API returns chapters.
- **Chapter** — Reads a single chapter’s title, order, and summary from the API.
- **Theme music** — Optional **looping** background track (user toggle); implemented with `expo-av` (`src/components/ThemeMusicControl.tsx`). Uses bundled audio at `assets/audio/harry.mp3`.
- **UI** — Custom “grimoire” styling: parchment motifs, fog, burn-style shells, loaders, bottom navigation on archive screens, Google fonts (MedievalSharp, IM Fell English).

---

## Tech stack

- **Runtime:** Expo / Metro
- **Navigation:** `@react-navigation/native`, `@react-navigation/native-stack`
- **Animation:** `react-native-reanimated`
- **Gestures:** `react-native-gesture-handler`
- **Graphics:** `react-native-svg`, `expo-linear-gradient`
- **Audio:** `expo-av`
- **Fonts:** `@expo-google-fonts/medievalsharp`, `@expo-google-fonts/im-fell-english`, `expo-font`

Exact versions are pinned in `package.json`.

---

## External API (data source)

- **Base URL:** `https://api.potterdb.com`
- **Style:** JSON:API (`/v1/{resource}` with pagination query params)
- **Client code:** `src/api/potterdb.ts`  
  - Lists: `fetchList(category, page, search)`  
  - Single entity: `fetchOne(category, id)`  
  - Chapters: `fetchChapters`, `fetchChapter`

No environment variables or secrets are required for API access.

---

## Prerequisites

- **Node.js** (LTS recommended) **or** [Bun](https://bun.sh) (project runs with `bun expo start` in development)
- **Expo Go** on a physical device, or **iOS Simulator** / **Android Emulator** for local runs
- **Network** for Potter DB requests

---

## Install and run

From the repository root (`grimoire/`):

```bash
npm install
```

Or with Bun:

```bash
bun install
```

Start the development server:

```bash
npm start
```

Or:

```bash
bun expo start
```

Then:

- Scan the QR code with **Expo Go** (Android) or the **Camera** app (iOS), or  
- Press **`i`** (iOS simulator), **`a`** (Android), or **`w`** (web) in the terminal.

**Note:** Web may differ slightly from native; this app is primarily designed for **iOS/Android**.

---

## Project layout (for code review)

```
grimoire/
├── App.tsx                 # Fonts, splash hide, root layout
├── index.ts                # Gesture handler + Reanimated imports, registers app
├── app.json                # Expo app name "The Grimoire", dark UI, plugins
├── src/
│   ├── api/
│   │   └── potterdb.ts     # All HTTP calls to Potter DB
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── types.ts        # Stack param list
│   │   └── rootNavigationRef.ts
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── CategoryScreen.tsx
│   │   ├── ListScreen.tsx
│   │   ├── DetailScreen.tsx
│   │   ├── ChapterScreen.tsx
│   │   └── detail/         # Per-type detail components and styles
│   ├── components/         # Shared UI (header, nav, fog, loaders, music, etc.)
│   └── theme/
│       └── colors.ts
└── assets/
    ├── audio/              # e.g. theme track for ThemeMusicControl
    └── images/             # App icons / imagery as used by the build
```

---

## Configuration highlights

- **App display name:** `The Grimoire` (`app.json` → `expo.name`)
- **New Architecture:** enabled (`newArchEnabled: true` in `app.json`)
- **Orientation:** portrait

---

## Known limitations (for fair judging)

1. **Internet required** — All entity data comes from Potter DB; offline mode is not implemented.
2. **`expo-av`** — Expo may log deprecation notices in favor of `expo-audio` in future SDKs; audio still uses `expo-av` today.
3. **Bundled assets** — Theme music expects `assets/audio/harry.mp3` to exist where referenced. Missing files will break bundling for that feature.

---

## Scripts (`package.json`)

| Script | Command |
|--------|---------|
| Start dev server | `npm start` → `expo start` |
| Android | `npm run android` |
| iOS | `npm run ios` |
| Web | `npm run web` |

---

## License / attribution

- **Potter DB** provides the dataset and API; follow their terms and attribution as required by that project.
- This repository is the hackathon **Grimoire** client UI only.
