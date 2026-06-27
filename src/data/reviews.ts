/**
 * Valoraciones/testimonios de clientes (datos estáticos).
 * 👉 Edita, añade o elimina entradas libremente.
 */

export interface Review {
  name: string;
  /** Localidad u otro dato breve del cliente. */
  location: string;
  /** Puntuación de 1 a 5 (se muestra en estrellas). */
  rating: number;
  text: string;
}

export const reviews: Review[] = [
  {
    name: 'María González',
    location: 'Valencia',
    rating: 5,
    text: 'Pintaron todo el piso en tres días y quedó impecable. Muy limpios, puntuales y cuidadosos con los muebles. Repetiremos sin duda.',
  },
  {
    name: 'Javier Ruiz',
    location: 'Torrent',
    rating: 5,
    text: 'Renovaron la fachada de nuestra comunidad. Presupuesto claro, sin sorpresas y un acabado excelente. Muy profesionales.',
  },
  {
    name: 'Lucía Martín',
    location: 'Paterna',
    rating: 4,
    text: 'Hicieron un estuco veneciano en el salón espectacular. Tardaron un poco más de lo previsto, pero el resultado mereció la pena.',
  },
  {
    name: 'Antonio Pérez',
    location: 'Valencia',
    rating: 5,
    text: 'Lacaron todas las puertas de casa y parecen nuevas. Ahorramos un dineral frente a cambiarlas. Trato cercano y honesto.',
  },
  {
    name: 'Carmen Navarro',
    location: 'Mislata',
    rating: 5,
    text: 'Solucionaron una humedad en la terraza que llevábamos años arrastrando. Por fin sin goteras. Totalmente recomendables.',
  },
];
