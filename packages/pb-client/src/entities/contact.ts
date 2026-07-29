import { z } from "zod";

const LinkGroup = z.object({
  label: z.string().default(""),
  href: z.string().default(""),
});

export const Contacts = z.object({
  phones: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
        primary: z.boolean().optional(),
      }),
    )
    .default([]),
  email: LinkGroup.default({ label: "", href: "" }),
  telegram: LinkGroup.default({ label: "", href: "" }),
  instagram: LinkGroup.default({ label: "", href: "" }),
  viber: LinkGroup.default({ label: "", href: "" }),
  address: z
    .object({
      line1: z.string().default(""),
      line2: z.string().default(""),
      hours: z.string().default(""),
      mapsUrl: z.string().default(""),
    })
    .default({ line1: "", line2: "", hours: "", mapsUrl: "" }),
  legal: z
    .object({
      entity: z.string().default(""),
      unp: z.string().default(""),
      legalAddress: z.string().default(""),
      registeredAt: z.string().default(""),
      bank: z
        .object({
          account: z.string().default(""),
          currency: z.string().default(""),
          name: z.string().default(""),
          bic: z.string().default(""),
        })
        .default({ account: "", currency: "", name: "", bic: "" }),
    })
    .default({
      entity: "",
      unp: "",
      legalAddress: "",
      registeredAt: "",
      bank: { account: "", currency: "", name: "", bic: "" },
    }),
});
export type Contacts = z.infer<typeof Contacts>;
