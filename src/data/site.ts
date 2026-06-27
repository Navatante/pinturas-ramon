/**
 * Configuración central de la empresa.
 *
 * 👉 Este es el ÚNICO archivo que necesitas editar para cambiar los datos de
 * contacto, redes sociales, horario, SEO, etc. Todos los componentes leen de aquí.
 */

export interface SocialLink {
  /** Nombre legible (también se usa como aria-label). */
  name: string;
  /** URL completa al perfil. */
  url: string;
}

export interface BusinessHours {
  /** Días a los que aplica, p.ej. "Lunes a Viernes". */
  days: string;
  /** Horario, p.ej. "8:00 – 18:00" o "Cerrado". */
  hours: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  slogan: string;
  description: string;
  /** Teléfono en formato legible para mostrar. */
  phoneDisplay: string;
  /** Teléfono en formato para enlaces tel: (sin espacios, con prefijo). */
  phoneRaw: string;
  email: string;
  /** Número de WhatsApp en formato internacional SIN '+' ni espacios (ej: 34600112233). */
  whatsappNumber: string;
  /** Mensaje precargado al abrir WhatsApp. */
  whatsappMessage: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    region: string;
    country: string;
    /** Coordenadas para el JSON-LD LocalBusiness (opcional pero recomendado). */
    latitude: number;
    longitude: number;
  };
  hours: BusinessHours[];
  social: SocialLink[];
}

export const site: SiteConfig = {
  name: 'Pinturas Ramón',
  legalName: 'Pinturas Ramón S.L.',
  slogan: 'Damos color a tu hogar y a tu negocio',
  description:
    'Empresa de pintura profesional con más de 20 años de experiencia. Pintura interior, exterior y decorativa con acabados de calidad. Pide presupuesto sin compromiso.',

  // Teléfono real que aparece en el logo de la marca.
  phoneDisplay: '634 799 347',
  phoneRaw: '+34634799347',
  email: 'info@pinturasramon.es',

  // 👉 Cambia el número y el mensaje a tu gusto. El número va SIN '+' ni espacios.
  whatsappNumber: '34634799347',
  whatsappMessage: 'Hola, me gustaría pedir un presupuesto de pintura.',

  address: {
    street: 'Calle del Pintor, 12',
    city: 'Valencia',
    postalCode: '46001',
    region: 'Valencia',
    country: 'España',
    latitude: 39.4699,
    longitude: -0.3763,
  },

  hours: [
    { days: 'Lunes a Viernes', hours: '8:00 – 18:00' },
    { days: 'Sábado', hours: '9:00 – 14:00' },
    { days: 'Domingo', hours: 'Cerrado' },
  ],

  social: [
    { name: 'Facebook', url: 'https://facebook.com/pinturasramon' },
    { name: 'Instagram', url: 'https://instagram.com/pinturasramon' },
  ],
};

/**
 * Construye la URL oficial de WhatsApp (wa.me) con el mensaje precargado.
 * Gratuita y oficial: en móvil abre la app, en escritorio abre WhatsApp Web.
 *
 * @param message Mensaje opcional para sobrescribir el predeterminado.
 */
export function whatsappUrl(message: string = site.whatsappMessage): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
