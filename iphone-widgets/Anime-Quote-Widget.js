// Daily Anime Quote widget for Scriptable (iPhone)
// Shows one anime quote per day. Works on the Lock Screen (rectangular)
// and Home Screen (small / medium / large).
// Quotes come from the free AnimeChan API (no key needed, 5 requests/hour limit).

// ---------- Settings ----------
const REFRESH_HOUR = 5;    // new quote from 5 AM
const MAX_LENGTH = 140;    // skip long quotes so they fit the lock screen
// Shows to rotate through, one per day. "" = any anime.
// Default: One Piece one day, any anime the next.
// Only One Piece: ["One Piece"]   More shows: ["One Piece", "Naruto", ""]
const ANIME_LIST = ["One Piece", ""];

// ---------- Today's key ----------
function todayKey() {
  const d = new Date();
  if (d.getHours() < REFRESH_HOUR) d.setDate(d.getDate() - 1);
  return d.toDateString();
}

// ---------- Fetch with offline cache ----------
async function getQuote() {
  const key = todayKey();
  const fm = FileManager.local();
  const path = fm.joinPath(fm.documentsDirectory(), "anime-quote.json");
  let cached = fm.fileExists(path) ? JSON.parse(fm.readString(path)) : null;
  if (cached && cached.key === key) return cached;

  const day = Math.floor(new Date(key).getTime() / 86400000);
  const anime = ANIME_LIST[((day % ANIME_LIST.length) + ANIME_LIST.length) % ANIME_LIST.length];
  let url = "https://api.animechan.io/v1/quotes/random";
  if (anime) url += "?anime=" + encodeURIComponent(anime);

  let best = null;
  for (let i = 0; i < 2; i++) {          // up to 2 tries to find a short one
    try {
      const res = await new Request(url).loadJSON();
      const q = res.data;
      const item = {
        key,
        text: q.content.replace(/\s+/g, " ").trim(),
        character: q.character && q.character.name ? q.character.name : "",
        anime: q.anime && q.anime.name ? q.anime.name : ""
      };
      if (!best || item.text.length < best.text.length) best = item;
      if (item.text.length <= MAX_LENGTH) break;
    } catch (e) { break; }
  }

  if (best) { fm.writeString(path, JSON.stringify(best)); return best; }
  if (cached) return cached;              // offline: keep yesterday's quote
  return { text: "No quote yet. Check your internet and it will load.", character: "", anime: "" };
}

// ---------- Build widget ----------
function buildWidget(q) {
  const family = config.widgetFamily || "medium";
  const w = new ListWidget();

  const next = new Date();
  if (next.getHours() >= REFRESH_HOUR) next.setDate(next.getDate() + 1);
  next.setHours(REFRESH_HOUR, 0, 5, 0);
  w.refreshAfterDate = next;

  const who = [q.character, q.anime].filter(Boolean).join(" · ");

  if (family.startsWith("accessory")) {
    w.addAccessoryWidgetBackground = true;
    const t = w.addText(`“${q.text}”`);
    t.font = Font.mediumSystemFont(12);
    t.minimumScaleFactor = 0.6;
    t.lineLimit = 3;
    if (q.character || q.anime) {
      const a = w.addText(`— ${q.character || q.anime}`);
      a.font = Font.systemFont(10);
      a.lineLimit = 1;
    }
    return w;
  }

  w.backgroundColor = new Color("#14121f");
  w.setPadding(14, 16, 14, 16);
  const h = w.addText("✦ Quote of the day");
  h.font = Font.semiboldSystemFont(11);
  h.textColor = new Color("#ff8fb1");
  w.addSpacer(6);
  const t = w.addText(`“${q.text}”`);
  t.font = Font.mediumSystemFont(family === "small" ? 13 : family === "large" ? 20 : 16);
  t.textColor = Color.white();
  t.minimumScaleFactor = 0.5;
  w.addSpacer();
  const a = w.addText(who ? `— ${who}` : "");
  a.font = Font.italicSystemFont(11);
  a.textColor = new Color("#b9b4d6");
  a.lineLimit = 1;
  a.minimumScaleFactor = 0.7;
  return w;
}

const quote = await getQuote();
const widget = buildWidget(quote);
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium(); // preview when run inside the app
}
Script.complete();
