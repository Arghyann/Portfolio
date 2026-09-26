"use client"

import {
  Terminal,
  TypingAnimation,
} from "@/registry/magicui/terminal"

export function MacTerminal() {
  return (
    <div className="space-y-6">
      <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
        Or.. here&apos;s a better portfolio:
      </p>

      <Terminal title="ssh">
        <div className="flex items-center gap-2">
          <span className="text-theme-accent select-none">$</span>
          <TypingAnimation delay={0}>
            ssh guest@aryanssh.duckdns.org
          </TypingAnimation>
        </div>
      </Terminal>
    </div>
  )
}
