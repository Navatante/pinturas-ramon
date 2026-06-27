/**
 * Catálogo de servicios. Se usa tanto en las tarjetas del home como en la
 * página de servicios y en el desplegable del formulario de contacto.
 */

export interface Service {
  /** Identificador único (también usado como value en el <select> del formulario). */
  id: string;
  title: string;
  /** Resumen corto para las tarjetas. */
  summary: string;
  /** Descripción larga para la página de servicios. */
  description: string;
  /** Lista de prestaciones concretas. */
  features: string[];
  /**
   * Nombre del icono SVG (heroicons-like) renderizado en ServiceCard.
   * Valores admitidos: 'home' | 'sun' | 'sparkles' | 'shield' | 'brush' | 'building'.
   */
  icon: 'home' | 'sun' | 'sparkles' | 'shield' | 'brush' | 'building';
}

export const services: Service[] = [
  {
    id: 'interior',
    title: 'Pintura interior',
    summary:
      'Paredes y techos impecables para tu vivienda o local, con mínimas molestias.',
    description:
      'Renovamos el interior de tu hogar o negocio con acabados lisos y uniformes. Protegemos muebles y suelos, preparamos las superficies (lijado, plastecido y reparación de grietas) y aplicamos pinturas de bajo olor y secado rápido para que puedas volver a usar la estancia cuanto antes.',
    features: [
      'Preparación y reparación de superficies',
      'Pinturas lavables y de bajo olor',
      'Limpieza y recogida al finalizar',
    ],
    icon: 'home',
  },
  {
    id: 'exterior',
    title: 'Pintura exterior',
    summary:
      'Fachadas protegidas frente a la humedad, el sol y el paso del tiempo.',
    description:
      'Tratamos y pintamos fachadas, muros y exteriores con productos resistentes a la intemperie y a los rayos UV. Aplicamos imprimaciones y revestimientos impermeabilizantes que prolongan la vida del paramento y mejoran el aislamiento, con medios de elevación homologados.',
    features: [
      'Tratamientos impermeabilizantes',
      'Pinturas resistentes a UV e intemperie',
      'Trabajos en altura con medios homologados',
    ],
    icon: 'sun',
  },
  {
    id: 'decorativa',
    title: 'Pintura decorativa',
    summary:
      'Estuco, veladuras y efectos especiales para espacios con personalidad.',
    description:
      'Damos un toque único a tus espacios con técnicas decorativas: estuco veneciano, veladuras, microcemento, efectos metalizados y murales personalizados. Te asesoramos sobre color y acabado para conseguir el ambiente que buscas.',
    features: [
      'Estuco veneciano y microcemento',
      'Veladuras y efectos metalizados',
      'Asesoramiento de color personalizado',
    ],
    icon: 'sparkles',
  },
  {
    id: 'lacado',
    title: 'Lacado y barnizado',
    summary:
      'Puertas, armarios y carpintería como nuevos, sin sustituirlos.',
    description:
      'Renovamos puertas, armarios, barandillas y todo tipo de carpintería de madera o metálica mediante lacado y barnizado. Conseguimos acabados duraderos y homogéneos a una fracción del coste de cambiar el mobiliario.',
    features: [
      'Lacado de puertas y armarios',
      'Barnizado de madera interior y exterior',
      'Acabados mate, satinado o brillo',
    ],
    icon: 'brush',
  },
  {
    id: 'impermeabilizacion',
    title: 'Impermeabilización',
    summary:
      'Adiós a goteras y humedades en cubiertas, terrazas y sótanos.',
    description:
      'Solucionamos problemas de humedad y filtraciones en cubiertas, terrazas, balcones y sótanos con membranas y resinas impermeabilizantes de larga duración, garantizando la estanqueidad y protegiendo la estructura.',
    features: [
      'Cubiertas y terrazas',
      'Tratamiento de humedades y filtraciones',
      'Membranas y resinas de larga duración',
    ],
    icon: 'shield',
  },
  {
    id: 'comunidades',
    title: 'Comunidades y empresas',
    summary:
      'Mantenimiento integral de pintura para edificios, naves y oficinas.',
    description:
      'Trabajamos con comunidades de propietarios, administradores de fincas y empresas ofreciendo presupuestos cerrados, planificación de obra y mínimas interferencias con la actividad. Zonas comunes, garajes, naves industriales y oficinas.',
    features: [
      'Presupuestos cerrados y planificados',
      'Zonas comunes, garajes y naves',
      'Trabajo coordinado con la actividad diaria',
    ],
    icon: 'building',
  },
];
