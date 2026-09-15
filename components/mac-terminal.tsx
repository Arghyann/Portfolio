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

      <Terminal title="guest@macbook ~ zsh">
        <TypingAnimation delay={0}>
          $ ssh guest@aryanssh.duckdns.org
        </TypingAnimation>
      </Terminal>
    </div>
  )
}
