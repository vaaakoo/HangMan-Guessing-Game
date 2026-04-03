/**
 * Client for Hangman REST API. Falls back to static /words.json when the API is unreachable
 * (for example static hosting without the Node server).
 */

const API_BASE = process.env.REACT_APP_API_URL || "";

async function parseJsonResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response");
  }
}

/**
 * @returns {Promise<{ word: string, definition: string, wordIndex?: number }>}
 */
export async function fetchRandomWordFromApi() {
  const url = `${API_BASE}/api/v1/words/random`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  const body = await parseJsonResponse(res);
  if (!res.ok) {
    const msg = body?.error?.message || res.statusText;
    throw new Error(msg || `Request failed (${res.status})`);
  }
  if (!body.data?.word || body.data.definition == null) {
    throw new Error("Malformed API payload");
  }
  return {
    word: body.data.word,
    definition: body.data.definition,
    wordIndex: body.data.wordIndex,
  };
}

/**
 * @returns {Promise<Record<string, string>>}
 */
export async function loadWordDictionary() {
  const res = await fetch("/words.json", { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Could not load word list");
  return parseJsonResponse(res);
}

/**
 * @returns {Promise<{ word: string, definition: string, wordIndex: number }>}
 */
export async function pickRandomFromDictionary(words) {
  const keys = Object.keys(words);
  if (keys.length === 0) throw new Error("Empty word list");
  const index = Math.floor(Math.random() * keys.length);
  const word = keys[index];
  return { word, definition: words[word], wordIndex: index };
}

/**
 * Prefers the API when available; otherwise loads /words.json and picks locally.
 * @returns {Promise<{ word: string, definition: string, wordIndex?: number, source: 'api' | 'static' }>}
 */
export async function fetchRandomWord() {
  try {
    const data = await fetchRandomWordFromApi();
    return { ...data, source: "api" };
  } catch {
    const dict = await loadWordDictionary();
    const data = await pickRandomFromDictionary(dict);
    return { ...data, source: "static" };
  }
}
