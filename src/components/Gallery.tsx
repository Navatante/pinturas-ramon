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
      {/* Grid de miniaturas */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((img, i) => (
          <li key={img.full}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
              aria-label={`Ampliar imagen: ${img.alt}`}
            >
              <img
                src={img.thumb}
                srcSet={img.thumbSrcset}
                sizes="(min-width: 640px) 33vw, 50vw"
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-slate-900/0 transition-colors group-hover:bg-slate-900/20" />
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
              <figcaption className="mt-3 text-center text-sm text-slate-300">
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
