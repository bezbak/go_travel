"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Option = { value: string; label: string };

type InquiryFormProps = {
  /** When present the form shows a tour picker; otherwise it is a plain enquiry. */
  tourOptions?: Option[];
  defaultTour?: string;
  className?: string;
};

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export function InquiryForm({
  tourOptions,
  defaultTour,
  className
}: InquiryFormProps) {
  const t = useTranslations("inquiry");
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    tour: defaultTour ?? tourOptions?.[0]?.value ?? "",
    people: "2",
    date: "",
    message: ""
  });

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));

    if (status !== "idle") {
      setStatus("idle");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors = {};

    if (values.name.trim().length < 2) {
      nextErrors.name = t("errors.name");
    }

    if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = t("errors.email");
    }

    if (values.message.trim().length < 10) {
      nextErrors.message = t("errors.message");
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    // No backend yet — the request is simulated so the flow can be demoed.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setValues((current) => ({
      ...current,
      name: "",
      email: "",
      phone: "",
      date: "",
      message: ""
    }));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-[18px] border border-[#c9dda3] bg-[#f4f9ea] p-[28px] text-center",
          className
        )}
      >
        <span className="mx-auto grid size-[52px] place-items-center rounded-full bg-[#6a9d17] text-white">
          <Check aria-hidden="true" className="size-6" strokeWidth={3} />
        </span>
        <h3 className="mt-4 font-display text-[19px] font-black uppercase text-[#171717]">
          {t("successTitle")}
        </h3>
        <p className="mx-auto mt-2 max-w-[380px] text-[13px] font-medium leading-[1.6] text-[#4f4f4f]">
          {t("successBody")}
        </p>
        <Button
          className="mt-6"
          size="sm"
          type="button"
          variant="dark"
          onClick={() => setStatus("idle")}
        >
          {t("sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <form
      className={cn(
        "rounded-[18px] border border-[#e7e2d9] bg-white p-[22px] shadow-[0_12px_36px_rgba(23,23,23,0.05)] sm:p-[28px]",
        className
      )}
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="grid gap-[16px] sm:grid-cols-2">
        <Field
          error={errors.name}
          id={`${formId}-name`}
          label={t("fields.name")}
          required
          value={values.name}
          onChange={(value) => update("name", value)}
        />
        <Field
          error={errors.email}
          id={`${formId}-email`}
          label={t("fields.email")}
          required
          type="email"
          value={values.email}
          onChange={(value) => update("email", value)}
        />
        <Field
          id={`${formId}-phone`}
          label={t("fields.phone")}
          type="tel"
          value={values.phone}
          onChange={(value) => update("phone", value)}
        />
        <Field
          id={`${formId}-date`}
          label={t("fields.date")}
          type="date"
          value={values.date}
          onChange={(value) => update("date", value)}
        />

        {tourOptions && tourOptions.length > 0 ? (
          <div className="grid gap-1.5">
            <label className={labelClass} htmlFor={`${formId}-tour`}>
              {t("fields.tour")}
            </label>
            <select
              className={inputClass}
              id={`${formId}-tour`}
              value={values.tour}
              onChange={(event) => update("tour", event.target.value)}
            >
              {tourOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="grid gap-1.5">
          <label className={labelClass} htmlFor={`${formId}-people`}>
            {t("fields.people")}
          </label>
          <select
            className={inputClass}
            id={`${formId}-people`}
            value={values.people}
            onChange={(event) => update("people", event.target.value)}
          >
            {["1", "2", "3", "4", "5", "6", "7", "8+"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-[16px] grid gap-1.5">
        <label className={labelClass} htmlFor={`${formId}-message`}>
          {t("fields.message")}
          <span aria-hidden="true" className="ml-1 text-[#f45a16]">
            *
          </span>
        </label>
        <textarea
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          aria-invalid={errors.message ? true : undefined}
          className={cn(inputClass, "h-[132px] resize-y py-3")}
          id={`${formId}-message`}
          placeholder={t("fields.messagePlaceholder")}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
        />
        {errors.message ? (
          <p className={errorClass} id={`${formId}-message-error`}>
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="mt-[20px] flex flex-wrap items-center gap-4">
        <Button disabled={status === "loading"} type="submit">
          {status === "loading" ? t("sending") : t("submit")}
        </Button>
        <p className="text-[12px] font-medium text-[#7a7a7a]">{t("privacyNote")}</p>
      </div>

      <p aria-live="polite" className="sr-only">
        {status === "error" ? t("errors.summary") : ""}
      </p>
    </form>
  );
}

const labelClass =
  "font-display text-[11px] font-extrabold uppercase tracking-[0.04em] text-[#7a7a7a]";

const inputClass =
  "h-[48px] w-full rounded-[10px] border border-[#ded9cd] bg-[#faf8f2] px-3 text-[13px] font-medium text-[#171717] transition duration-200 placeholder:text-[#a3a3a3] focus:border-[#6a9d17] focus:bg-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#6a9d17]";

const errorClass = "text-[12px] font-semibold text-[#c0392b]";

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
};

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  error
}: FieldProps) {
  return (
    <div className="grid gap-1.5">
      <label className={labelClass} htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-[#f45a16]">
            *
          </span>
        ) : null}
      </label>
      <input
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(inputClass, error && "border-[#c0392b]")}
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p className={errorClass} id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
