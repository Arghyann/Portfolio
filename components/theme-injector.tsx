"use client"

import { getTheme, ACTIVE_THEME } from "@/lib/themes"
import { useEffect } from "react"

/**
 * Reads the active Omarchy theme and maps its colors to CSS custom properties.
 * Exposes ALL theme colors so they can be used throughout the site.
 */
export function ThemeInjector() {
  useEffect(() => {
    const t = getTheme(ACTIVE_THEME)
    const root = document.documentElement

    if (t.mode === "dark") {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.add("light")
      root.classList.remove("dark")
    }

    // Core UI mappings
    const vars: Record<string, string> = {
      "--background": t.background,
      "--foreground": t.foreground,
      "--card": t.darkBackground,
      "--card-foreground": t.foreground,
      "--popover": t.darkBackground,
      "--popover-foreground": t.foreground,
      "--primary": t.accent,
      "--primary-foreground": t.darkerBackground,
      "--secondary": t.lighterBackground,
      "--secondary-foreground": t.lightForeground,
      "--muted": t.lighterBackground,
      "--muted-foreground": t.lightForeground,
      "--accent": t.lighterBackground,
      "--accent-foreground": t.lightForeground,
      "--destructive": t.red,
      "--destructive-foreground": t.red,
      "--border": t.selection,
      "--input": t.selection,
      "--ring": t.muted,

      // Semantic mappings for blog & typography
      "--color-text": t.foreground,
      "--color-text-bold": t.brightForeground,
      "--color-math": t.yellow,
      "--color-code": t.green,
      "--color-link": t.accent,
      "--color-bg": t.background,
      "--color-muted": t.lightForeground,

      // All Omarchy palette colors
      "--theme-accent": t.accent,
      "--theme-selection": t.selection,
      "--theme-muted": t.muted,
      "--theme-bg": t.background,
      "--theme-bg-dark": t.darkBackground,
      "--theme-bg-darker": t.darkerBackground,
      "--theme-bg-lighter": t.lighterBackground,
      "--theme-fg": t.foreground,
      "--theme-fg-dark": t.darkForeground,
      "--theme-fg-light": t.lightForeground,
      "--theme-fg-bright": t.brightForeground,
      "--theme-red": t.red,
      "--theme-yellow": t.yellow,
      "--theme-orange": t.orange,
      "--theme-green": t.green,
      "--theme-cyan": t.cyan,
      "--theme-blue": t.blue,
      "--theme-magenta": t.magenta,
      "--theme-brown": t.brown,
    }

    for (const [prop, value] of Object.entries(vars)) {
      root.style.setProperty(prop, value)
    }
  }, [])

  return null
}
