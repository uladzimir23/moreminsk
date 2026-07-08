import PocketBase from "pocketbase";

// Prod: админка и PB на одном origin (admin.more-minsk.by → /api, /_/), поэтому
// VITE_PB_URL не задаём. Локально — http://127.0.0.1:8090 (.env).
export const pb = new PocketBase(
  import.meta.env.VITE_PB_URL || window.location.origin,
);
pb.autoCancellation(false);
