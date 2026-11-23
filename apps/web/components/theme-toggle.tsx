"use client";

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Switches between the light and dark theme (UI-rules §2). The icon, label and
 * tooltip are swapped with the `dark:` variant rather than from React state, so
 * the server HTML is already right and nothing changes on hydration.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          />
        }
      >
        <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} aria-hidden className="size-5 dark:hidden" />
        <HugeiconsIcon icon={Sun03Icon} strokeWidth={2} aria-hidden className="hidden size-5 dark:block" />
        <span className="sr-only dark:hidden">Switch to dark theme</span>
        <span className="sr-only hidden dark:inline">Switch to light theme</span>
      </TooltipTrigger>
      <TooltipContent>
        <span className="dark:hidden">Switch to dark theme</span>
        <span className="hidden dark:inline">Switch to light theme</span>
      </TooltipContent>
    </Tooltip>
  );
}
