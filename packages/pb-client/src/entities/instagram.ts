import { z } from "zod";

// PB хранит key; фронт использует id.
export const InstagramStory = z
  .object({
    key: z.string(),
    cover: z.string(),
    caption: z.string(),
    author: z.string(),
    date: z.string(),
    url: z.string(),
  })
  .transform((v) => ({
    id: v.key,
    cover: v.cover,
    caption: v.caption,
    author: v.author,
    date: v.date,
    url: v.url,
  }));
export type InstagramStory = z.infer<typeof InstagramStory>;
