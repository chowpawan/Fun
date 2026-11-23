# iPhone widgets

## Daily anime quote (`Anime-Quote-Widget.js`)

A lock screen / home screen widget that shows one anime quote per day, refreshing each morning after 5 AM. It alternates between One Piece quotes and quotes from any anime.

Quotes come from the free [AnimeChan API](https://animechan.io) (no key, 5 requests/hour; the widget makes one request a day and caches it for offline use).

### Setup

1. Install [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) from the App Store.
2. In Scriptable, tap **+**, paste in `Anime-Quote-Widget.js`, name it, and tap ▶︎ to preview.
3. Long-press the lock screen → **Customize** → **Lock Screen** → add a **Scriptable** widget (rectangular).
4. Tap the widget and choose the script.

### Settings (top of the script)

| Setting | What it does |
| --- | --- |
| `ANIME_LIST` | Shows to rotate through, one per day. `""` = any anime. Default `["One Piece", ""]`. |
| `REFRESH_HOUR` | Hour the new quote appears (default 5 AM). |
| `MAX_LENGTH` | Skips quotes longer than this so they fit the lock screen. |
