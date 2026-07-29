import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// SPA-админка. В проде раздаётся nginx:alpine за admin.more-minsk.by/, PB — на
// том же origin (/api, /_/), поэтому VITE_PB_URL в проде не задаём (origin).
// Локально — VITE_PB_URL=http://127.0.0.1:8090 (см. .env.example).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: "dist", sourcemap: false },
});
