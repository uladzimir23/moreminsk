import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BookingDraft, BookingPanelPayload, BookingSource } from "./types";

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

type SubmitState = "idle" | "submitting" | "ok" | "error";

type BookingStore = {
  step: WizardStep;
  draft: BookingDraft;
  submitState: SubmitState;
  lastSubmittedId?: string;
  lastError?: string;

  goNext: () => void;
  goBack: () => void;
  goToStep: (step: WizardStep) => void;
  patch: (patch: Partial<BookingDraft>) => void;
  hydrateFromPayload: (payload: BookingPanelPayload | undefined, source: BookingSource) => void;
  reset: () => void;
  markSubmitting: () => void;
  markSuccess: (id: string) => void;
  markError: (message: string) => void;
};

const EMPTY_DRAFT: BookingDraft = {
  package: { kind: "none" },
  contact: {},
  policyAccepted: false,
};

// Hydration rule: payload.yachtSlug jumps the wizard past Step 1.
// payload.serviceSlug sets Step 3 pre-selection but the user still confirms.
export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      step: 1,
      draft: { ...EMPTY_DRAFT },
      submitState: "idle",

      goNext: () => {
        const next = Math.min(6, get().step + 1) as WizardStep;
        set({ step: next });
      },
      goBack: () => {
        const back = Math.max(1, get().step - 1) as WizardStep;
        set({ step: back });
      },
      goToStep: (step) => set({ step }),

      patch: (patch) => set({ draft: { ...get().draft, ...patch } }),

      hydrateFromPayload: (payload, source) => {
        const draft: BookingDraft = { ...EMPTY_DRAFT, source };
        let step: WizardStep = 1;
        if (payload?.yachtSlug) {
          draft.yachtSlug = payload.yachtSlug;
          step = 2;
        }
        if (payload?.serviceSlug) {
          draft.package = { kind: "service", serviceSlug: payload.serviceSlug };
        }
        if (payload?.source) draft.source = payload.source;
        set({ draft, step, submitState: "idle", lastError: undefined });
      },

      reset: () =>
        set({
          step: 1,
          draft: { ...EMPTY_DRAFT },
          submitState: "idle",
          lastSubmittedId: undefined,
          lastError: undefined,
        }),

      markSubmitting: () => set({ submitState: "submitting", lastError: undefined }),
      markSuccess: (id) => set({ submitState: "ok", lastSubmittedId: id, step: 6 }),
      markError: (message) => set({ submitState: "error", lastError: message }),
    }),
    {
      name: "moreminsk-booking-draft",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ draft: s.draft, step: s.step }),
    },
  ),
);
