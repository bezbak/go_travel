import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "dark" | "light" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "border-[#5f9616] bg-[#6a9d17] text-white shadow-[0_8px_20px_rgba(95,150,22,0.18)] hover:bg-[#5a8f12]",
  outline: "border-[#262626] bg-white/30 text-[#161616] hover:bg-white/70",
  dark: "border-[#262626] bg-[#181818] text-white hover:bg-[#2a2a2a]",
  light: "border-white/60 bg-white text-[#171717] hover:bg-[#f2efe6]",
  ghost:
    "border-transparent bg-transparent text-[#669a17] hover:border-[#c9dda3] hover:bg-[#f2f7e9]"
};

const sizes: Record<Size, string> = {
  sm: "h-[48px] px-[30px] text-[12px]",
  md: "h-[56px] px-[38px] text-[13px]",
  lg: "h-[62px] px-[44px] text-[14px]"
};

const baseClass =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[12px] border font-display font-extrabold uppercase tracking-[0] transition duration-200 ease-out hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6a9d17] disabled:pointer-events-none disabled:opacity-60";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: Size;
  variant?: Variant;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  size?: Size;
  variant?: Variant;
  /** Route the click through the locale-aware router instead of a raw anchor. */
  internal?: boolean;
};

export function Button({
  className,
  children,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseClass, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  className,
  children,
  href,
  size = "md",
  variant = "primary",
  internal,
  ...props
}: ButtonLinkProps) {
  const classes = cn(baseClass, variants[variant], sizes[size], className);

  if (internal) {
    return (
      <Link className={classes} href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a className={classes} href={href} {...props}>
      {children}
    </a>
  );
}
