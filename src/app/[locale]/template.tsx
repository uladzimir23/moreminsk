"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// App Router re-mounts a template on every navigation, so this gives each page
// a gentle enter animation — a smooth cross-fade between pages. Opacity only:
// a transform here would create a containing block and break the home page's
// `position: sticky` cinematic hero.
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0.15 : 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
