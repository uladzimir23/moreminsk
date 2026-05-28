"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import styles from "./Tooltip.module.scss";

type Props = {
  content: React.ReactNode;
  children: React.ReactNode;
};

// Editorial tooltip on Radix headless. Wrap any focusable trigger; pass the
// hint as `content`. Theme-aware, portaled.
export function Tooltip({ content, children }: Props) {
  return (
    <RadixTooltip.Provider delayDuration={120}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content className={styles.content} sideOffset={6} collisionPadding={12}>
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
