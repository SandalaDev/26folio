#!/usr/bin/env node
// scripts/spotify-authorize.mjs — one-time Spotify authorization for the
// "10s" playlist reader (EPIC-018/TASK-074).
//
// Why: Spotify strips playlist tracks from client-credentials responses
// for development-mode apps, and the public embed page caps the track
// list at 100 rows. A user-authorized token (no scopes needed for a
// public playlist) reads the full paged track list. This script captures
// that authorization ONCE and stores the refresh token in .env.local;
// src/lib/spotify.ts then silently exchanges it per request.
//
// Before running, open https://developer.spotify.com/dashboard, edit the
// app's settings and add this EXACT redirect URI:
//
//   http://127.0.0.1:8888/callback
//
// Then: node scripts/spotify-authorize.mjs
// Open the printed URL, approve, done. The refresh token is written to
// .env.local (never committed; .env* is gitignored and a protected path).

import fs from "node:fs";
import http from "node:http";
import crypto from "node:crypto";

const ENV_FILE = ".env.local";
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const PORT = 8888;

function readEnv() {
  const env = {};
  if (!fs.existsSync(ENV_FILE)) {
    console.error(`[spotify-authorize] ${ENV_FILE} not found; add SPOTIFY_CLIENT_ID/SECRET first.`);
    process.exit(1);
  }
  for (const line of fs.readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

function writeRefreshToken(tokenValue) {
  let text = fs.readFileSync(ENV_FILE, "utf8");
  if (/^SPOTIFY_REFRESH_TOKEN=.*$/m.test(text)) {
    text = text.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, `SPOTIFY_REFRESH_TOKEN=${tokenValue}`);
  } else {
    if (!text.endsWith("\n")) text += "\n";
    text += `SPOTIFY_REFRESH_TOKEN=${tokenValue}\n`;
  }
  fs.writeFileSync(ENV_FILE, text);
}

const env = readEnv();
if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
  console.error(`[spotify-authorize] SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET missing in ${ENV_FILE}.`);
  process.exit(1);
}

const state = crypto.randomBytes(16).toString("hex");
const authorizeUrl =
  "https://accounts.spotify.com/authorize" +
  `?client_id=${encodeURIComponent(env.SPOTIFY_CLIENT_ID)}` +
  "&response_type=code" +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&state=${state}`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const fail = (msg) => {
    res.writeHead(400, { "Content-Type": "text/plain" }).end(msg);
    console.error(`[spotify-authorize] ${msg}`);
    server.close();
    process.exitCode = 1;
  };
  if (url.searchParams.get("state") !== state) return fail("State mismatch; run the script again.");
  if (url.searchParams.get("error")) return fail(`Spotify said: ${url.searchParams.get("error")}`);
  const code = url.searchParams.get("code");
  if (!code) return fail("No code in callback.");

  const basic = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      `grant_type=authorization_code&code=${encodeURIComponent(code)}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
  });
  if (!tokenRes.ok) return fail(`Token exchange failed: ${tokenRes.status} ${await tokenRes.text()}`);
  const json = await tokenRes.json();
  if (!json.refresh_token) return fail("Token response had no refresh_token.");

  writeRefreshToken(json.refresh_token);
  res.writeHead(200, { "Content-Type": "text/html" }).end(
    "<body style='font-family:sans-serif'><h2>Done.</h2><p>SPOTIFY_REFRESH_TOKEN saved to .env.local. You can close this tab and restart the dev server.</p></body>",
  );
  console.log(`[spotify-authorize] refresh token saved to ${ENV_FILE}. Restart the dev server.`);
  server.close();
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("[spotify-authorize] waiting for the callback on " + REDIRECT_URI);
  console.log("[spotify-authorize] open this URL and approve:\n");
  console.log(authorizeUrl + "\n");
});
