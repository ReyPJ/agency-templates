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
    url: "https://axxdental.vercel.app",
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

  doctors: [
    {
      name: "Dr. Alexander Patiño",
      role: "Director clínico",
      duties: "Primer contacto con el paciente, análisis, diagnóstico y endodoncia.",
      quote:
        "Me apasiona devolver la salud, función y estética a nuestros pacientes con atención personalizada. Disfruto explicar de forma clara y gráfica cada tratamiento, y que cada paciente se sienta seguro, informado y acompañado durante su proceso.",
      personalNote:
        "Colecciona piedras de distintas partes del mundo. Le gustan la jardinería y el sushi.",
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
      personalNote: "Baila salsa, come helado y escucha cantos de ballenas.",
      photo: {
        src: "/doctores/ximena.jpg",
        alt: "Retrato de la Dra. Ximena",
        width: 480,
        height: 600,
      },
    },
  ],

  specialties: [
    {
      name: "Ortodoncia",
      solves: "Endereza tus dientes y corrige tu mordida con brackets, alineadores o aparatos.",
    },
    {
      name: "Endodoncia",
      solves: "Salva un diente infectado por dentro, en vez de sacarlo.",
    },
    {
      name: "Periodoncia",
      solves: "Trata tus encías cuando sangran, se inflaman o se están retirando.",
    },
    {
      name: "Odontopediatría",
      solves: "Atiende a bebés, niños y adolescentes, y les enseña a cuidarse desde chicos.",
    },
    {
      name: "Estética Dental",
      solves: "Cambia el color y la forma de tus dientes: blanqueamiento, carillas y diseño de sonrisa.",
    },
    {
      name: "Cirugía Oral",
      solves: "Resuelve lo que necesita quirófano: muelas del juicio, frenillos, quistes e injertos.",
    },
    {
      name: "Implantología",
      solves: "Repone un diente que perdiste con un implante fijo que no se quita.",
    },
  ],

  titles: {
    doctors: "Quién te va a atender",
    specialties: "Especialidades",
  },

  reviews: {
    title: "Lo que dicen los pacientes",
    themes: [
      "Explican cada procedimiento hasta que se entiende, que es lo que tranquiliza a quien llega nervioso.",
      "El trato es personal: la gente dice que se siente en casa.",
      "La amabilidad es lo primero que mencionan.",
    ],
  },

  location: {
    title: "Dónde estamos",
    area: "Ciudad Satélite, Naucalpan, Estado de México",
  },
};

export const clinic: Clinic = validateClinic(data);
