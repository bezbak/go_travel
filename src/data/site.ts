import { images, type ImageAsset } from "./images";

export const contact = {
  phone: "+996 555 123 456",
  phoneHref: "tel:+996555123456",
  whatsapp: "+996 555 123 456",
  whatsappHref: "https://wa.me/996555123456",
  email: "hello@go-kyrgyzstan.travel",
  emailHref: "mailto:hello@go-kyrgyzstan.travel",
  addressLines: ["Chuy Avenue 148, office 12", "Bishkek 720000, Kyrgyzstan"],
  mapQuery: "Chuy Avenue 148, Bishkek, Kyrgyzstan"
};

export const social = [
  { key: "instagram", href: "https://instagram.com" },
  { key: "facebook", href: "https://facebook.com" },
  { key: "youtube", href: "https://youtube.com" }
] as const;

/** Values are pre-formatted so they read the same in every locale. */
export const companyStats = [
  { key: "years", value: "12" },
  { key: "travellers", value: "7 400+" },
  { key: "tours", value: "24" },
  { key: "rating", value: "4.9/5" }
] as const;

export type TeamMember = {
  key: string;
  name: string;
  image: ImageAsset;
};

export const team: TeamMember[] = [
  { key: "aizhan", name: "Aizhan Toktogulova", image: images.songKol },
  { key: "ulan", name: "Ulan Beishenaliev", image: images.kyzartHorses },
  { key: "marat", name: "Marat Sydykov", image: images.kilemche },
  { key: "elena", name: "Elena Voronina", image: images.bishkekSunset }
];

export type Testimonial = {
  key: string;
  name: string;
  countryKey: string;
  tourSlug: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    key: "lena",
    name: "Lena Bauer",
    countryKey: "germany",
    tourSlug: "heart-of-kyrgyzstan",
    rating: 5
  },
  {
    key: "tom",
    name: "Tom Whitfield",
    countryKey: "uk",
    tourSlug: "kel-suu-expedition",
    rating: 5
  },
  {
    key: "sofia",
    name: "Sofia Marchetti",
    countryKey: "italy",
    tourSlug: "song-kol-nomad-life",
    rating: 5
  },
  {
    key: "hugo",
    name: "Hugo Lefevre",
    countryKey: "france",
    tourSlug: "issyk-kul-and-jeti-oguz",
    rating: 4
  }
];

/** Keys resolve against the `faq.items.*` namespace in the message catalogue. */
export const faqKeys = [
  "visa",
  "fitness",
  "accommodation",
  "food",
  "payment",
  "solo",
  "weather",
  "custom"
] as const;

export const bookingSteps = ["choose", "confirm", "prepare", "travel"] as const;
