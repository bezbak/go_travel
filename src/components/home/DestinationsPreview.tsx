import { useTranslations } from "next-intl";

import { DestinationCard } from "@/components/destinations/DestinationCard";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { destinations } from "@/data/destinations";

export function DestinationsPreview() {
  const t = useTranslations("destinationsSection");

  return (
    <Section
      action={
        <ButtonLink href="/destinations" internal size="sm" variant="dark">
          {t("cta")}
        </ButtonLink>
      }
      align="left"
      className="bg-white"
      description={t("description")}
      eyebrow={t("eyebrow")}
      id="destinations-preview"
      title={
        <>
          {t("titleDark")} <span className="text-[#669a17]">{t("titleGreen")}</span>
        </>
      }
    >
      <div className="grid gap-[20px] sm:grid-cols-2 xl:grid-cols-3">
        {destinations.slice(0, 6).map((destination) => (
          <DestinationCard key={destination.slug} destination={destination} />
        ))}
      </div>
    </Section>
  );
}
