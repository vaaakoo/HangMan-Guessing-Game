const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const PORT = Number(process.env.PORT) || 3001;
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const WORDS_PATH = path.join(PUBLIC_DIR, "words.json");

const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: true }));
app.use(express.json());

function requestId(req, res, next) {
  const id = req.header("x-request-id") || crypto.randomUUID();
  res.setHeader("x-request-id", id);
  req.requestId = id;
  next();
}

app.use(requestId);

let wordsCache = null;

function loadWords() {
  if (wordsCache) return wordsCache;
  const raw = fs.readFileSync(WORDS_PATH, "utf8");
  wordsCache = JSON.parse(raw);
  return wordsCache;
}

function pickRandomEntry(words) {
  const keys = Object.keys(words);
  if (keys.length === 0) {
    const err = new Error("No words available");
    err.status = 503;
    throw err;
  }
  const index = Math.floor(Math.random() * keys.length);
  const word = keys[index];
  return { word, definition: words[word], index };
}

app.get("/api/v1/health", (req, res) => {
  res.json({
    data: { status: "ok", version: "1.0.0" },
    meta: { requestId: req.requestId },
  });
});

app.get("/api/v1/words", (req, res) => {
  try {
    const words = loadWords();
    const keys = Object.keys(words);
    res.json({
      data: { count: keys.length },
      meta: { requestId: req.requestId },
    });
  } catch (e) {
    res.status(500).json({
      error: { code: "WORDS_LOAD_FAILED", message: "Could not load word list" },
      meta: { requestId: req.requestId },
    });
  }
});

app.get("/api/v1/words/random", (req, res) => {
  try {
    const words = loadWords();
    const payload = pickRandomEntry(words);
    res.json({
      data: {
        word: payload.word,
        definition: payload.definition,
        wordIndex: payload.index,
      },
      meta: { requestId: req.requestId },
    });
  } catch (e) {
    const status = e.status || 500;
    res.status(status).json({
      error: {
        code: status === 503 ? "NO_WORDS" : "RANDOM_WORD_FAILED",
        message: e.message || "Unexpected error",
      },
      meta: { requestId: req.requestId },
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: "Route not found" },
    meta: { requestId: req.requestId },
  });
});

app.listen(PORT, () => {
  console.log(`Hangman API listening on http://localhost:${PORT}`);
});
