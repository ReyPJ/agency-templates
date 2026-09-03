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

/** The imported asset, not a path. Astro reads the real dimensions from it,
 *  which removes a whole class of typo, and only then can it emit WebP and a
 *  srcset — images left in public/ are served untouched. */
export interface Image {
  src: ImageMetadata;
  alt: string;
}

export interface Brand {
  name: string;
  kind: string;
  tagline?: string;
  /** Favicon and the closing mark of the location section, never the nav. */
  logo?: Image;
  /** Health-authority registration. Almost no competitor publishes theirs,
   *  so it is a cheap and real credibility marker in the colophon. */
  registration?: { label: string; value: string };
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

/* Doctors and specialties are sections like any other, so they carry their
   own heading and lead-in rather than having them kept in a separate bag. */

export interface DoctorsSection {
  title: string;
  intro?: string;
  people: Doctor[];
}

export interface SpecialtiesSection {
  title: string;
  intro?: string;
  items: Specialty[];
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

/** Hard numbers, shown as a band right below the hero. Deliberately a short
 *  list of facts rather than marketing claims — the point is that a visitor
 *  can size the clinic up in two seconds without scrolling. */
export interface Highlight {
  value: string;
  label: string;
}

/** The last thing a visitor reads before leaving, so it carries the final
 *  call to action rather than trailing off into contact details. */
export interface Closing {
  headline: string;
  cta: string;
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
  doctors: DoctorsSection;
  specialties: SpecialtiesSection;
  closing: Closing;
  highlights?: Highlight[];

  rating?: Rating;
  method?: Method;
  reviews?: Reviews;
  location?: Location;
}
