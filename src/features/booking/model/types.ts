import type { Service } from "@/entities/service/model/types";
import type { Yacht } from "@/entities/yacht/model/types";

export type YachtSlug = Yacht["slug"];
export type ServiceSlug = Service["slug"];

export type DurationOption =
  | { kind: "hours"; hours: 1 | 2 | 3 | 4 | 6 }
  | { kind: "day" }
  | { kind: "night" }
  | { kind: "multi-day" };

export type PackageRef =
  | { kind: "none" }
  | { kind: "service"; serviceSlug: ServiceSlug }
  | { kind: "turnkey"; serviceSlug: ServiceSlug };

export type PreferredContact = "telegram" | "phone" | "whatsapp";

export type BookingSource =
  | "appbar"
  | "bottom-nav"
  | "yacht-card"
  | "hero"
  | "service-page"
  | "inline-form"
  | "cta-finale";

export interface ContactFields {
  name: string;
  phone: string;
  preferredContact: PreferredContact;
  email?: string;
  comment?: string;
}

export interface BookingDraft {
  yachtSlug?: YachtSlug | "any";
  date?: string;
  timeSlot?: string;
  duration?: DurationOption;
  package: PackageRef;
  guests?: number;
  contact: Partial<ContactFields>;
  policyAccepted: boolean;
  source?: BookingSource;
}

export interface Booking {
  yachtSlug: YachtSlug | "any";
  date: string;
  timeSlot?: string;
  duration: DurationOption;
  package: PackageRef;
  guests: number;
  contact: ContactFields;
  policyAccepted: true;
  estimatedPrice: number | "on-request";
  createdAt: string;
  source: BookingSource;
}

export type BookingPanelPayload = {
  yachtSlug?: YachtSlug;
  serviceSlug?: ServiceSlug;
  source?: BookingSource;
};
