// Одна точка входа со всеми ридерами. Для более узкого импорта см.
// подпути "@moreminsk/pb-client/entities/*", "/readers/*", "/leads/submit".
export * from "./entities/yacht";
export * from "./entities/service";
export * from "./entities/faq";
export * from "./entities/certificate";
export * from "./entities/contact";
export * from "./entities/document";
export * from "./entities/instagram";

export { getYachts, getYacht } from "./readers/yachts";
export { getServices, getService } from "./readers/services";
export { getFaq } from "./readers/faq";
export { getCertificate } from "./readers/certificate";
export { getContacts } from "./readers/contacts";
export { getDocuments, getDocument } from "./readers/documents";
export { getInstagramStories } from "./readers/instagram";

export { submitLead, LeadPayload } from "./leads/submit";
