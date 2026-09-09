import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  compact?: boolean;
};

export function Container({ className, compact, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1840px] px-[clamp(14px,3.6vw,72px)] 2xl:px-0",
        compact && "max-w-[1816px] 2xl:px-0",
        className
      )}
      {...props}
    />
  );
}
