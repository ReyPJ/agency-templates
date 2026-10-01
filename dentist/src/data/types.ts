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

/** A photograph that carries a short line under it. Captions say what the
 *  picture is — "Recepción" — never a slogan. */
export interface Photo extends Image {
  caption?: string;
  /** CSS object-position for the crop, e.g. "50% 20%". Keeps faces and the
   *  logo inside the frame when a picture is cut to a different ratio. */
  focus?: string;
}

/** Each variant is a complete set of sections built over the same data, so
 *  two clinics on the same template do not look like the same site.
 *  - editorial: type-led, no photography. For clients with no usable images.
 *  - studio: photo-led and architectural. For clinics with a space worth showing.
 *  - warm: soft and close, family-oriented. Arched photography, rounder shapes. */
export type Variant = "editorial" | "studio" | "warm";

export interface Brand {
  name: string;
  kind: string;
  tagline?: string;
  /** Favicon and the closing mark of the location section, never the nav. */
  logo?: Image;
  /** A crisp, transparent wordmark (PNG or SVG), as opposed to `logo`, which
   *  is often a low-resolution square. When present, studio sets it in the
   *  nav (`dark`) and signs the dark footer with it (`light`). */
  wordmark?: { dark: Image; light?: Image };
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
  /** Full profile URLs. Linked in the footer and emitted as schema.org sameAs. */
  social?: { instagram?: string; facebook?: string };
}

export interface Hero {
  /** One entry per line — the staggered reveal animates line by line. */
  headline: string[];
  subhead: string;
  cta: string;
  /** Used by studio and warm. Editorial is type-only and ignores it. */
  image?: Photo;
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
  /** Only the doctor's own words. Never write one for them: without a real
   *  quote the variants lead with the duties instead. */
  quote?: string;
  personalNote?: string;
  license?: string;
  photo?: Image;
}

export interface Specialty {
  name: string;
  solves: string;
  /** Studio shows it beside the list while this entry is open. */
  image?: Image;
}

/* Doctors and specialties are sections like any other, so they carry their
   own heading and lead-in rather than having them kept in a separate bag. */

export interface DoctorsSection {
  title: string;
  intro?: string;
  people: Doctor[];
  /** The whole team in one frame. Used by studio and warm. */
  groupPhoto?: Photo;
}

export interface SpecialtiesSection {
  title: string;
  intro?: string;
  items: Specialty[];
}

/** Published prices. Many clinics quote none, so the whole block is optional;
 *  when present it is one of the strongest reasons to write rather than to
 *  keep searching, because almost no competitor shows them. */
export interface Service {
  name: string;
  /** As the visitor should read it, currency included: "$1,100". */
  price?: string;
  /** "Varias sesiones", "Incluye diagnóstico"… */
  note?: string;
}

export interface Services {
  title: string;
  intro?: string;
  items: Service[];
  /** Fine print under the list, e.g. what a price does or does not include. */
  footnote?: string;
}

/** The clinic's own space. Used by studio and warm; editorial ignores it. */
export interface Gallery {
  title: string;
  intro?: string;
  photos: Photo[];
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
  /** Background photograph for the studio close. */
  image?: Photo;
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
  /** Defaults to editorial. PUBLIC_VARIANT in the environment overrides it,
   *  which is how the three variants are previewed over the same data. */
  variant?: Variant;
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
  services?: Services;
  gallery?: Gallery;
}
