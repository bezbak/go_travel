"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  header: ReactNode;
  content: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  /** Index opened on first render; pass `-1` to start fully collapsed. */
  defaultOpen?: number;
  /** When false, opening a panel closes the others. */
  allowMultiple?: boolean;
  className?: string;
};

export function Accordion({
  items,
  defaultOpen = 0,
  allowMultiple = false,
  className
}: AccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>(() =>
    items[defaultOpen] ? [items[defaultOpen].id] : []
  );

  function toggle(id: string) {
    setOpenIds((current) => {
      if (current.includes(id)) {
        return current.filter((openId) => openId !== id);
      }

      return allowMultiple ? [...current, id] : [id];
    });
  }

  return (
    <div className={cn("grid gap-[10px]", className)}>
      {items.map((item) => {
        const open = openIds.includes(item.id);
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;

        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-[14px] border bg-white transition duration-200",
              open
                ? "border-[#c9dda3] shadow-[0_14px_38px_rgba(23,23,23,0.07)]"
                : "border-[#e8e5df]"
            )}
          >
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={open}
                className="flex w-full items-center gap-4 px-[18px] py-[18px] text-left transition duration-200 hover:bg-[#f8f6ef] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#6a9d17] sm:px-[24px]"
                id={buttonId}
                type="button"
                onClick={() => toggle(item.id)}
              >
                <span className="min-w-0 flex-1">{item.header}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-[30px] shrink-0 place-items-center rounded-full transition duration-200",
                    open
                      ? "rotate-180 bg-[#6a9d17] text-white"
                      : "bg-[#f0ede4] text-[#4f4f4f]"
                  )}
                >
                  <ChevronDown className="size-4" strokeWidth={2.6} />
                </span>
              </button>
            </h3>

            <div
              aria-labelledby={buttonId}
              className={cn(!open && "hidden")}
              id={panelId}
              role="region"
            >
              <div className="border-t border-[#eeebe3] px-[18px] py-[20px] sm:px-[24px]">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
