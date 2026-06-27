/**
 * Galería de trabajos realizados.
 *
 * Importamos las imágenes como assets para que el componente <Image> de Astro
 * las optimice (formatos modernos, tamaños responsive). 👉 Reemplaza los
 * archivos de src/assets por tus fotos reales manteniendo los imports.
 */
import type { ImageMetadata } from 'astro';

import trabajo1 from '../assets/trabajo-1.jpg';
import trabajo2 from '../assets/trabajo-2.jpg';
import trabajo3 from '../assets/trabajo-3.jpg';
import trabajo4 from '../assets/trabajo-4.jpg';
import trabajo5 from '../assets/trabajo-5.jpg';
import trabajo6 from '../assets/trabajo-6.jpg';

export interface GalleryItem {
  src: ImageMetadata;
  /** Texto alternativo descriptivo (accesibilidad obligatoria). */
  alt: string;
  /** Pie de foto opcional mostrado en el lightbox. */
  caption?: string;
}

export const gallery: GalleryItem[] = [
  { src: trabajo1, alt: 'Salón pintado en tonos cálidos', caption: 'Pintura interior — Vivienda en Valencia' },
  { src: trabajo2, alt: 'Fachada de edificio recién pintada', caption: 'Pintura exterior — Comunidad en Torrent' },
  { src: trabajo3, alt: 'Pared con acabado de estuco decorativo', caption: 'Estuco veneciano — Salón en Paterna' },
  { src: trabajo4, alt: 'Puertas lacadas en blanco', caption: 'Lacado de carpintería — Vivienda en Valencia' },
  { src: trabajo5, alt: 'Terraza impermeabilizada', caption: 'Impermeabilización — Terraza en Mislata' },
  { src: trabajo6, alt: 'Oficina con paredes recién pintadas', caption: 'Pintura comercial — Oficinas' },
];
