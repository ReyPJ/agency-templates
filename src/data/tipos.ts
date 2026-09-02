export interface Tema {
  fondo: string;            // base clara
  superficie: string;       // bloques sutiles sobre el fondo
  tinta: string;            // texto principal
  tintaSuave: string;       // texto secundario
  borde: string;
  acento: string;
  acentoTinta: string;      // texto sobre el acento
  inversoFondo: string;     // el bloque oscuro
  inversoTinta: string;
  inversoTintaSuave: string;
  acentoClaro: string;      // solo legible sobre inversoFondo
}

export interface Marca {
  nombre: string;           // "AXX Dental"
  tipo: string;             // "Clínica dental de especialidades"
  tagline?: string;         // "Salud. Función. Estética."
  logo?: Imagen;            // favicon y cierre de Ubicación, nunca el nav
}

export interface Contacto {
  whatsapp: string;         // OBLIGATORIO — solo dígitos, con lada país
  mensajeWhatsapp: string;  // OBLIGATORIO — texto pre-armado del wa.me
  telefono: string;         // OBLIGATORIO — formato E.164
  telefonoVisible: string;  // OBLIGATORIO — cómo se muestra
}

export interface Hero {
  titular: string[];        // una entrada por línea; el escalonado anima por línea
  bajada: string;
  cta: string;
}

export interface Calificacion {
  puntaje: number;          // 4.9
  total: number;            // 84
  fuente: string;           // "Google"
  actualizadoHace?: string; // "hace 2 semanas"
  urlPerfil?: string;
}

export interface PasoMetodo { rotulo: string; texto: string }

export interface Metodo {
  titulo: string;
  entrada?: string;
  pasos: PasoMetodo[];      // 3 en AXX, pero N en el tipo
}

export interface Doctor {
  nombre: string;
  rol: string;              // "Director clínico"
  funcion: string;
  cita: string;
  notaPersonal?: string;    // el fun fact, sin rótulo
  cedula?: string;
  foto?: Imagen;
}

export interface Especialidad { nombre: string; resuelve: string }

export interface Resena { texto: string; autor: string; fecha?: string }

export interface Resenas {
  titulo: string;
  consensos: string[];      // los patrones que se repiten
  textuales?: Resena[];
}

export interface Horario { dias: string; horas: string }

export interface Ubicacion {
  titulo: string;
  zona: string;             // "Ciudad Satélite, Naucalpan"
  direccion?: string[];     // una entrada por línea
  urlMapa?: string;
  horarios?: Horario[];
  formasPago?: string[];
  mesesSinIntereses?: boolean;
}

export interface Imagen { src: string; alt: string; ancho: number; alto: number }

export interface Clinica {
  marca: Marca;
  contacto: Contacto;
  tema: Tema;
  seo: { titulo: string; descripcion: string; url: string };

  hero: Hero;
  doctores: Doctor[];          // 1..N
  especialidades: Especialidad[]; // 1..N

  // metodo, resenas y ubicacion cargan su propio titulo; doctores y
  // especialidades son arrays pelados, así que sus encabezados viven aquí.
  // Sin esto terminarían escritos a mano en index.astro, que es un dato de
  // cliente fuera de clinica.ts y rompe la reutilización.
  titulos: { doctores: string; especialidades: string };

  calificacion?: Calificacion;
  metodo?: Metodo;
  resenas?: Resenas;
  ubicacion?: Ubicacion;
}
