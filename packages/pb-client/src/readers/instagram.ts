import { z } from "zod";
import { InstagramStory } from "../entities/instagram";
import { readSnapshot } from "./snapshot";

const Schema = z.array(InstagramStory);
let cached: InstagramStory[] | null = null;

export function getInstagramStories(): InstagramStory[] {
  if (cached) return cached;
  cached = readSnapshot("instagram_stories", Schema);
  return cached;
}
