import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** `full`: icon and wordmark. `icon`: the icon alone, for the collapsed sidebar rail. */
  variant?: "full" | "icon";
  /** Only for comparing candidate icons on /dev/ui. */
  icon?: IconSvgElement;
  className?: string;
};

/**
 * The SiteLens logo until a real one exists (UI-rules §2): the wordmark in
 * Oxanium semibold next to a Hugeicons lens icon in the primary color. It is
 * not a link; the app shell wraps it in one.
 */
export function Logo({ variant = "full", icon = Search01Icon, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <HugeiconsIcon icon={icon} strokeWidth={2} aria-hidden className="size-5 shrink-0 text-primary" />
      {variant === "full" ? (
        <span className="font-heading text-lg leading-none font-semibold">SiteLens</span>
      ) : (
        <span className="sr-only">SiteLens</span>
      )}
    </span>
  );
}
