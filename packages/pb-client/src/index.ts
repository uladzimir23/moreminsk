// Публичный API пакета — types + zod-схемы + leads-submit.
// Snapshot readers НЕ реэкспортируем: они server-only (node:fs) и не должны
// попадать в client-бандл. Импортируй их напрямую из "@moreminsk/pb-client/readers/*".
export * from "./entities/yacht";
export * from "./entities/service";
export * from "./entities/faq";
export * from "./entities/certificate";
export * from "./entities/contact";
export * from "./entities/document";
export * from "./entities/instagram";

export { submitLead, LeadPayload } from "./leads/submit";
