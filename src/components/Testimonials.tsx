import { useEffect, useState } from 'react';
import type { Review } from '../data/reviews';

/**
 * Carrusel de valoraciones de clientes (React).
 * - Autoplay pausable (al pasar el ratón o enfocar).
 * - Navegación con flechas y puntos.
 * - Accesible: aria-roledescription, botones etiquetados.
 */

interface Props {
  reviews: Review[];
  /** Milisegundos entre transiciones automáticas. */
  interval?: number;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex justify-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={i < rating ? 'h-5 w-5 text-gold-500' : 'h-5 w-5 text-slate-300'}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.05 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.176 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.354 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ reviews, interval = 6000 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (i: number) => setIndex((i + reviews.length) % reviews.length);

  // Autoplay (se detiene si el usuario pausa o reduce el movimiento).
  useEffect(() => {
    if (paused || reviews.length <= 1) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), interval);
    return () => clearInterval(id);
  }, [paused, interval, reviews.length]);

  const review = reviews[index];

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carrusel"
      aria-label="Valoraciones de clientes"
    >
      <figure className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100 sm:p-10">
        <Stars rating={review.rating} />
        <blockquote className="mt-5 text-lg leading-relaxed text-slate-700">
          “{review.text}”
        </blockquote>
        <figcaption className="mt-5 font-semibold text-slate-900">
          {review.name}
          <span className="block text-sm font-normal text-slate-500">{review.location}</span>
        </figcaption>
      </figure>

      {/* Flechas */}
      {reviews.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Valoración anterior"
            className="absolute -left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-slate-600 shadow-md ring-1 ring-slate-200 transition-colors hover:text-brand-600 sm:-left-5"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Valoración siguiente"
            className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-slate-600 shadow-md ring-1 ring-slate-200 transition-colors hover:text-brand-600 sm:-right-5"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Puntos indicadores */}
          <div className="mt-6 flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Ir a la valoración ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-brand-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
