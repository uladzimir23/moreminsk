// Instagram-style story highlights for the reviews section. Media reuses the
// scraped yacht photos (portrait → perfect 9:16); each slide carries optional
// IG-style sticker fields (location pin, caption, @mention, reaction, poll,
// CTA footer) so the viewer can recreate the repost aesthetic.

import { PHOTOS_BY_YACHT } from "./photos";

export type StorySlide = {
  url: string;
  location?: string;
  caption?: string;
  mention?: string;
  reaction?: string;
  poll?: string;
  cta?: string;
};

export type StoryGroup = {
  id: string;
  title: string;
  handle: string;
  weeks: number;
  cover: string;
  slides: ReadonlyArray<StorySlide>;
};

export const STORY_GROUPS: ReadonlyArray<StoryGroup> = [
  {
    id: "otzyvy",
    title: "Отзывы",
    handle: "nastya_rudzkaya",
    weeks: 159,
    cover: PHOTOS_BY_YACHT.eva[0],
    slides: [
      {
        url: PHOTOS_BY_YACHT.eva[0],
        location: "Минское море",
        caption: "самый настоящий кайф тут 😍🥰",
        mention: "@moreminsk.by",
        cta: "ХОЧЕШЬ ТАКЖЕ? СКОРЕЕ ЗАПИСЫВАЙСЯ НА ПРОГУЛКУ ❤️",
      },
      {
        url: PHOTOS_BY_YACHT.eva[4],
        caption: "Закат на EVA — лучшее решение за лето 🌅",
      },
      {
        url: PHOTOS_BY_YACHT.eva[7],
        reaction: "Красотка 👍",
        mention: "@moreminsk.by",
      },
    ],
  },
  {
    id: "mario",
    title: "MARIO",
    handle: "moreminsk.by",
    weeks: 204,
    cover: PHOTOS_BY_YACHT.mario[0],
    slides: [
      {
        url: PHOTOS_BY_YACHT.mario[0],
        caption: "Девичник мчит 🛥️🥂",
        location: "Минское море",
      },
      { url: PHOTOS_BY_YACHT.mario[2], poll: "Прокатились бы на MARIO? 🔥" },
      { url: PHOTOS_BY_YACHT.mario[4], reaction: "Огонь 🔥🔥" },
    ],
  },
  {
    id: "eva-hl",
    title: "EVA",
    handle: "moreminsk.by",
    weeks: 203,
    cover: PHOTOS_BY_YACHT.eva[1],
    slides: [
      {
        url: PHOTOS_BY_YACHT.eva[1],
        reaction: "Красотка 👍👍",
        poll: "Вы хотите пройтись на EVA 😍",
      },
      { url: PHOTOS_BY_YACHT.eva[2], location: "Минское море" },
      { url: PHOTOS_BY_YACHT.eva[5], caption: "Под парусом на закате ⛵️" },
    ],
  },
  {
    id: "bravo",
    title: "BRAVO",
    handle: "moreminsk.by",
    weeks: 180,
    cover: PHOTOS_BY_YACHT.bravo[0],
    slides: [
      {
        url: PHOTOS_BY_YACHT.bravo[0],
        caption: "Корпоратив на флагмане 🥂",
        mention: "@moreminsk.by",
      },
      { url: PHOTOS_BY_YACHT.bravo[2], reaction: "VIP-вечер ✨" },
    ],
  },
  {
    id: "alfa",
    title: "ALFA",
    handle: "moreminsk.by",
    weeks: 170,
    cover: PHOTOS_BY_YACHT.alfa[0],
    slides: [
      {
        url: PHOTOS_BY_YACHT.alfa[0],
        caption: "День рождения на воде 🎂",
        location: "Минское море",
      },
      { url: PHOTOS_BY_YACHT.alfa[3], poll: "Хочешь так же? 🙌" },
    ],
  },
];
