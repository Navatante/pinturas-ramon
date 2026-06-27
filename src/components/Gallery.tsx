import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Galería interactiva con lightbox (React).
 *
 * La OPTIMIZACIÓN de imágenes la hace Astro (componente Gallery.astro, que usa
 * getImage y pasa aquí las URLs ya optimizadas + srcset). Este componente solo
 * aporta la interactividad: abrir/cerrar el lightbox y navegar con teclado/ratón.
 */

export interface GalleryImage {
  /** URL de la versión grande (lightbox). */
  full: string;
  /** URL del thumbnail (grid). */
  thumb: string;
  /** srcset responsive para el thumbnail. */
  thumbSrcset: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

interface Props {
  images: GalleryImage[];
}

/**
 * Patrón "bento": la primera imagen ocupa un bloque grande y la última una banda
 * ancha; el resto son cuadradas. Se repite si hay más imágenes.
 */
const SPANS = [
  'sm:col-span-2 sm:row-span-2',
  '',
  '',
  '',
  '',
  'sm:col-span-2',
];

export default function Gallery({ images }: Props) {
  // null = lightbox cerrado; número = índice de la imagen abierta.
  const [active, setActive] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const isOpen = active !== null;

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );

  // Navegación por teclado y bloqueo del scroll del fondo mientras está abierto.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Llevar el foco al botón de cerrar (accesibilidad).
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close, next, prev]);

  return (
    <>
      {/* Grid "bento" de miniaturas */}
      <ul className="grid auto-rows-[150px] grid-cols-2 gap-4 sm:grid-cols-4 sm:auto-rows-[170px]">
        {images.map((img, i) => (
          <li key={img.full} className={SPANS[i % SPANS.length]}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group relative block h-full w-full overflow-hidden rounded-2xl border border-[#ddcfb8] bg-[#e6d8c0] shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-terracotta-400"
              aria-label={`Ampliar imagen: ${img.alt}`}
            >
              <img
                src={img.thumb}
                srcSet={img.thumbSrcset}
                sizes="(min-width: 640px) 50vw, 50vw"
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#231a13]/55 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              {img.caption && (
                <span className="pointer-events-none absolute bottom-3 left-3 right-3 translate-y-1 text-left text-[12.5px] font-medium text-[#fbf7ee] opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  {img.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      {isOpen && active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          {/* Cerrar */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Anterior */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Imagen anterior"
            className="absolute left-2 sm:left-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Imagen + pie (stopPropagation para no cerrar al hacer clic en ella) */}
          <figure className="max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[active].full}
              alt={images[active].alt}
              className="mx-auto max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {images[active].caption && (
              <figcaption className="mt-3 text-center text-sm text-[#d8cdbb]">
                {images[active].caption}
              </figcaption>
            )}
          </figure>

          {/* Siguiente */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Imagen siguiente"
            className="absolute right-2 sm:right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
