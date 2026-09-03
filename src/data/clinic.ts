import type { Clinic } from "./types.ts";
import { validateClinic } from "./validate.ts";

// Everything that changes between clients lives in this file. Components never
// name a client, so a new one is resolved here and nowhere else.

const data: Clinic = {
  brand: {
    name: "AXX Dental",
    kind: "Clínica dental de especialidades",
    tagline: "Salud. Función. Estética.",
    logo: {
      src: "/axxlogo.jpg",
      alt: "AXX Dental",
      width: 960,
      height: 960,
    },
    registration: { label: "COFEPRIS", value: "2315122002A00021" },
  },

  contact: {
    whatsapp: "525579627102",
    whatsappMessage: "Hola, vi su sitio y quiero agendar una valoración.",
    phone: "+525579627102",
    phoneDisplay: "55 7962 7102",
  },

  theme: {
    background: "#FCFCFB",
    surface: "#F1F4F3",
    ink: "#14181A",
    inkSoft: "#5A6461",
    line: "#E3E7E6",
    accent: "#1F6B66",
    accentInk: "#FCFCFB",
    invertedBackground: "#0E2926",
    invertedInk: "#EDF3F1",
    invertedInkSoft: "#8FA5A0",
    accentLight: "#A0F8E2",
  },

  seo: {
    title: "AXX Dental — Clínica dental de especialidades en Ciudad Satélite",
    description:
      "Antes de tocar un diente, escuchamos. Clínica dental de especialidades en Ciudad Satélite, Naucalpan. 4.9 de 5 en 84 reseñas de Google.",
    url: "https://axxdental.reynerpaniagua.dev",
  },

  hero: {
    // One entry per line: the staggered reveal animates line by line.
    headline: ["Antes de tocar", "un diente,", "escuchamos."],
    subhead: "Clínica dental de especialidades en Ciudad Satélite, Naucalpan.",
    cta: "Agendar valoración",
  },

  rating: {
    score: 4.9,
    count: 84,
    source: "Google",
    updatedAgo: "hace 2 semanas",
  },

  method: {
    title: "Cómo diagnosticamos",
    steps: [
      {
        label: "Antes",
        text: "Todo comienza con una conversación: revisamos tu historial médico y escuchamos tus síntomas antes de tocar un solo diente.",
      },
      {
        label: "Durante",
        text: "Aquí miramos a fondo: estudio 3D, radiografías y exploración clínica completa, sin suposiciones.",
      },
      {
        label: "Después",
        text: "Los resultados se explican, no se imponen. Armamos juntos un plan de tratamiento claro, por escrito y a tu medida.",
      },
    ],
  },

  doctors: {
    title: "Quién te va a atender",
    people: [
      {
        name: "Dr. Alexander Patiño",
        role: "Director clínico",
        duties: "Primer contacto con el paciente, análisis, diagnóstico y endodoncia.",
        quote:
          "Me apasiona devolver la salud, función y estética a nuestros pacientes con atención personalizada. Disfruto explicar de forma clara y gráfica cada tratamiento, y que cada paciente se sienta seguro, informado y acompañado durante su proceso.",
        personalNote:
          "Colecciono piedras de distintas partes del mundo, y me gustan mucho la jardinería y el sushi.",
        photo: {
          src: "/doctores/alexander.jpg",
          alt: "Retrato del Dr. Alexander Patiño",
          width: 480,
          height: 600,
        },
      },
      {
        name: "Dra. Ximena",
        role: "Coordinadora clínica",
        duties: "Primer contacto con el paciente, análisis y diagnóstico.",
        quote:
          "Me apasiona guiar a nuestros pacientes hacia una odontología preventiva y conservadora, brindando herramientas y hábitos sostenibles para una salud bucal óptima a largo plazo.",
        personalNote: "Bailo salsa, como helado y escucho cantos de ballenas.",
        photo: {
          src: "/doctores/ximena.jpg",
          alt: "Retrato de la Dra. Ximena",
          width: 480,
          height: 600,
        },
      },
    ],
  },

  specialties: {
    title: "Especialidades",
    intro:
      "Todas en el mismo lugar, para toda la familia y en cada momento de tu vida.",
    items: [
      {
        name: "Ortodoncia",
        solves:
          "Mueve los dientes y la mandíbula a su lugar, con brackets o con alineadores. No es solo cómo se ve: es cómo muerdes.",
      },
      {
        name: "Endodoncia",
        solves:
          "Cuando la infección llega al nervio, se limpia el diente por dentro. Es lo que evita tener que sacarlo.",
      },
      {
        name: "Periodoncia",
        solves:
          "Encías que sangran, se inflaman o se retiran, y el hueso que sostiene los dientes. Desde una gingivitis hasta una periodontitis avanzada.",
      },
      {
        name: "Odontopediatría",
        solves:
          "Bebés, niños y adolescentes. Se previenen caries, se vigila cómo van saliendo los dientes y se arman hábitos que duran.",
      },
      {
        name: "Estética Dental",
        solves:
          "Color, forma y proporción de la sonrisa: blanqueamiento, carillas, composite y diseño de sonrisa.",
      },
      {
        name: "Cirugía Oral",
        solves:
          "Muelas del juicio, frenillos, quistes, injertos de hueso y todo lo que hay que hacer antes de un implante.",
      },
      {
        name: "Implantología",
        solves:
          "Un implante de titanio ocupa el lugar del diente que perdiste y se integra al hueso. Función y estética, de forma permanente.",
      },
    ],
  },

  closing: {
    headline: "Los resultados se explican, no se imponen.",
    cta: "Agendar mi valoración",
  },

  reviews: {
    title: "Lo que dicen los pacientes",
    themes: [
      "Explican cada paso antes de darlo, y lo repiten las veces que haga falta. Es lo que más agradece quien llega con miedo.",
      "Nadie se siente un número. El trato es de casa.",
      "Lo primero que casi todos mencionan es la amabilidad.",
    ],
  },

  location: {
    title: "Dónde estamos",
    area: "Ciudad Satélite, Naucalpan, Estado de México",
  },
};

export const clinic: Clinic = validateClinic(data);
