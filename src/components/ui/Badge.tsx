import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "green" | "dark" | "orange" | "muted" | "outline";

const tones: Record<Tone, string> = {
  green: "bg-[#6a9d17] text-white",
  dark: "bg-[#181818] text-white",
  orange: "bg-[#f45a16] text-white",
  muted: "bg-[#eef2e6] text-[#4b6f10]",
  outline: "border border-[#dcd7cb] bg-white/80 text-[#3f3f3f]"
};

type BadgeProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

export function Badge({ children, tone = "green", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 truncate rounded-full px-[clamp(6px,0.9vw,12px)] py-[5px] font-display text-[length:var(--fs-3xs)] font-black uppercase leading-none tracking-[0.04em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
