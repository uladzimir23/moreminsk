import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware Link/redirect/usePathname/useRouter wrappers.
// Always import navigation primitives from here, not from `next/navigation`,
// so locale prefixes are handled correctly per `routing.localePrefix`.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
