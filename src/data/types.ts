export interface Theme {
  background: string;
  surface: string;
  ink: string;
  inkSoft: string;
  line: string;
  accent: string;
  accentInk: string;
  invertedBackground: string;
  invertedInk: string;
  invertedInkSoft: string;
  /** Only legible against invertedBackground. */
  accentLight: string;
}

export interface Image {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Brand {
  name: string;
  kind: string;
  tagline?: string;
  /** Favicon and the closing mark of the location section, never the nav. */
  logo?: Image;
}

export interface Contact {
  /** Digits only, country code included, no "+" and no spaces. */
  whatsapp: string;
  whatsappMessage: string;
  /** E.164. */
  phone: string;
  phoneDisplay: string;
}

export interface Hero {
  /** One entry per line — the staggered reveal animates line by line. */
  headline: string[];
  subhead: string;
  cta: string;
}

export interface Rating {
  score: number;
  count: number;
  source: string;
  updatedAgo?: string;
  profileUrl?: string;
}

export interface MethodStep {
  label: string;
  text: string;
}

export interface Method {
  title: string;
  intro?: string;
  steps: MethodStep[];
}

export interface Doctor {
  name: string;
  role: string;
  duties: string;
  quote: string;
  personalNote?: string;
  license?: string;
  photo?: Image;
}

export interface Specialty {
  name: string;
  solves: string;
}

export interface Review {
  text: string;
  author: string;
  date?: string;
}

export interface Reviews {
  title: string;
  /** Patterns that repeat across the clinic's public reviews. */
  themes: string[];
  quotes?: Review[];
}

export interface Hours {
  days: string;
  time: string;
}

export interface Location {
  title: string;
  area: string;
  /** One entry per line. */
  address?: string[];
  mapUrl?: string;
  hours?: Hours[];
  paymentMethods?: string[];
  installments?: boolean;
}

export interface Clinic {
  brand: Brand;
  contact: Contact;
  theme: Theme;
  seo: { title: string; description: string; url: string };

  hero: Hero;
  doctors: Doctor[];
  specialties: Specialty[];

  // method, reviews and location each carry their own title; doctors and
  // specialties are bare arrays, so their headings live here. Without this
  // they would end up hardcoded in index.astro — client copy outside
  // clinic.ts, which is exactly what breaks reuse.
  titles: { doctors: string; specialties: string };

  rating?: Rating;
  method?: Method;
  reviews?: Reviews;
  location?: Location;
}
