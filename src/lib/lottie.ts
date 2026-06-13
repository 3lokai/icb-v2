// src/lib/lottie.ts
//
// Point the dotLottie runtime at our self-hosted WASM instead of the default
// external CDN (unpkg/jsdelivr). The 1.5MB player WASM is copied into public/ by
// scripts/copy-lottie-wasm.mjs and served same-origin from Vercel's edge, so
// loading animations paint reliably and fast instead of stalling on a
// third-party CDN fetch.
//
// Import this module (it runs setWasmUrl as a side effect) before rendering any
// DotLottieReact component.

import { setWasmUrl } from "@lottiefiles/dotlottie-react";

setWasmUrl("/dotlottie-player.wasm");
