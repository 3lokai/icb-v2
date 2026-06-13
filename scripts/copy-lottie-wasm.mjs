// scripts/copy-lottie-wasm.mjs
//
// Copies the dotLottie player WASM runtime from node_modules into public/ so it
// can be served same-origin (from Vercel's edge) instead of being fetched from
// an external CDN (unpkg/jsdelivr) at runtime. Pairs with setWasmUrl() in
// src/lib/lottie.ts.
//
// Copying (rather than committing the binary) guarantees the WASM version always
// matches the installed @lottiefiles/dotlottie-web runtime — a mismatch silently
// breaks playback. Runs on postinstall and prebuild.

import { copyFile, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SRC = join(
  root,
  "node_modules",
  "@lottiefiles",
  "dotlottie-web",
  "dist",
  "dotlottie-player.wasm"
);
const DEST = join(root, "public", "dotlottie-player.wasm");

try {
  await access(SRC, constants.R_OK);
} catch {
  // dotlottie-web may not be installed yet (e.g. a partial install). Skip
  // quietly rather than failing the whole install/build.
  console.warn("[copy-lottie-wasm] Source WASM not found, skipping:", SRC);
  process.exit(0);
}

await mkdir(dirname(DEST), { recursive: true });
await copyFile(SRC, DEST);
console.log("[copy-lottie-wasm] Copied dotlottie-player.wasm -> public/");
