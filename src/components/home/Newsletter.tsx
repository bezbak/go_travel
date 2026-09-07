"use client";

import { Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type Status = "idle" | "loading" | "success" | "error" | "invalid";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!emailPattern.test(email.trim())) {
      setStatus("invalid");
      return;
    }

    setStatus("loading");

    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      setEmail("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const message =
    status === "success"
      ? t("success")
      : status === "invalid"
        ? t("invalid")
        : status === "error"
          ? t("error")
          : "";

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-title"
      className="topographic-pattern bg-[#fbfaf0] py-[58px] 2xl:py-[74px]"
    >
      <Container compact className="grid items-center gap-8 xl:grid-cols-[1fr_0.96fr]">
        <div className="flex min-w-0 flex-col items-start gap-[18px] sm:flex-row sm:items-center sm:gap-[26px] xl:pl-[110px] 2xl:pl-[126px]">
          <span
            aria-label={t("iconLabel")}
            className="grid size-[58px] shrink-0 place-items-center rounded-full bg-[#dce9c4] text-[#669a17] sm:size-[74px]"
          >
            <Mail aria-hidden="true" className="size-[30px] sm:size-[38px]" strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[15px] font-black uppercase leading-tight tracking-[0] text-[#669a17] sm:text-[18px]">
              {t("eyebrow")}
            </p>
            <h2
              id="newsletter-title"
              className="mt-[8px] max-w-[520px] font-display text-[28px] font-black uppercase leading-[1.05] tracking-[0] text-[#669a17] sm:text-[37px] 2xl:text-[42px]"
            >
              {t("title")}
            </h2>
            <p className="mt-[10px] max-w-[430px] text-[13px] font-medium leading-[1.55] text-[#555555] 2xl:text-[14px]">
              {t("description")}
            </p>
          </div>
        </div>

        <form
          className="min-w-0 w-full xl:pr-[110px] 2xl:pr-[126px]"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="flex min-h-[62px] overflow-hidden rounded-[8px] border border-[#d6d1c5] bg-white shadow-[0_14px_35px_rgba(23,23,23,0.05)] focus-within:border-[#669a17]">
            <label className="sr-only" htmlFor="newsletter-email">
              {t("inputLabel")}
            </label>
            <input
              className="min-w-0 flex-1 px-4 text-[13px] font-medium text-[#171717] outline-none placeholder:text-[#9a9a9a] sm:px-[28px] sm:text-[14px]"
              id="newsletter-email"
              inputMode="email"
              placeholder={t("placeholder")}
              type="email"
              value={email}
              aria-describedby={message ? "newsletter-message" : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") {
                  setStatus("idle");
                }
              }}
            />
            <Button
              className="h-auto rounded-none border-0 px-4 text-[10px] sm:px-[50px] sm:text-[12px]"
              disabled={status === "loading"}
              type="submit"
            >
              {status === "loading" ? t("loading") : t("submit")}
            </Button>
          </div>
          <p
            aria-live="polite"
            className="mt-3 min-h-[20px] text-[12px] font-semibold text-[#669a17]"
            id="newsletter-message"
          >
            {message}
          </p>
        </form>
      </Container>
    </section>
  );
}
