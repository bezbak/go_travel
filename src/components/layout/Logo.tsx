import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LogoProps = {
  homeAria: string;
  logoText: string;
  name: string;
  tagline?: string;
  inverted?: boolean;
  small?: boolean;
};

export function Logo({
  homeAria,
  logoText,
  name,
  tagline,
  inverted,
  small
}: LogoProps) {
  return (
    <Link
      aria-label={homeAria}
      className="group flex items-center gap-[6px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6a9d17] sm:gap-[14px]"
      href="/"
    >
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full bg-[#f45a16] text-center font-display font-black lowercase leading-none text-white shadow-[0_10px_24px_rgba(244,90,22,0.22)]",
          small ? "size-[40px] text-[7px] sm:size-[48px] sm:text-[8px]" : "size-[40px] text-[7px] sm:size-[54px] sm:text-[9px]"
        )}
      >
        {logoText}
      </span>
      <span className="grid gap-[2px]">
        <span
          className={cn(
            "whitespace-nowrap font-display text-[13px] font-black uppercase leading-none tracking-[0] transition-colors duration-200 sm:text-[18px]",
            inverted ? "text-white" : "text-[#111111]"
          )}
        >
          {name}
        </span>
        {tagline ? (
          <span
            className={cn(
              "hidden text-[11px] font-semibold leading-none tracking-[0] min-[370px]:block",
              inverted ? "text-white/62" : "text-[#373737]/75"
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
