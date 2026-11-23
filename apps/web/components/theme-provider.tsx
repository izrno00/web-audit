"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Light and dark themes (UI-rules §2) through the `.dark` class. With no saved
 * choice the system setting decides; the toggle saves "light" or "dark" in
 * localStorage. next-themes injects a small inline script that sets the class
 * before the first paint, so there is no flash.
 *
 * The props are fixed on purpose: the injected script must stay byte-for-byte
 * the same, so the CSP in T06 can allow it by hash without a nonce (a nonce
 * would force every page to render per request).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
