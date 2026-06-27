import { useState } from 'react';
import { services } from '../data/services';

/**
 * Formulario de contacto (React).
 *
 * - Validación en cliente con TypeScript (requeridos + email).
 * - Estados de envío: idle | loading | success | error.
 * - Protección anti-spam: campo honeypot oculto ("company").
 * - Destino configurable por variable de entorno:
 *     PUBLIC_CONTACT_PROVIDER = 'formspree' | 'resend'
 *       · formspree → POST a https://formspree.io/f/<PUBLIC_FORMSPREE_ID>
 *       · resend    → POST a /api/contact (endpoint serverless de Astro)
 */

// Las variables PUBLIC_* se exponen al cliente (Astro/Vite).
const PROVIDER = (import.meta.env.PUBLIC_CONTACT_PROVIDER ?? 'formspree') as
  | 'formspree'
  | 'resend';
const FORMSPREE_ID = import.meta.env.PUBLIC_FORMSPREE_ID as string | undefined;

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  /** Honeypot: debe quedar SIEMPRE vacío (los bots lo rellenan). */
  company: string;
}

const initialValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  company: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    // Limpia el error del campo en cuanto el usuario lo corrige.
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  /** Validación en cliente. Devuelve true si todo es válido. */
  function validate(): boolean {
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) next.name = 'Indica tu nombre.';
    if (!values.email.trim()) next.email = 'Indica tu email.';
    else if (!EMAIL_RE.test(values.email)) next.email = 'El email no es válido.';
    if (!values.message.trim()) next.message = 'Cuéntanos qué necesitas.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Si el honeypot está relleno, simulamos éxito y abortamos (es un bot).
    if (values.company) {
      setStatus('success');
      return;
    }
    if (!validate()) return;

    setStatus('loading');
    try {
      let response: Response;

      if (PROVIDER === 'formspree') {
        if (!FORMSPREE_ID) throw new Error('Falta PUBLIC_FORMSPREE_ID');
        response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        });
      } else {
        // Endpoint serverless propio (envía email con Resend).
        response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setStatus('success');
      setValues(initialValues);
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
      setStatus('error');
    }
  }

  // Pantalla de éxito.
  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900">¡Mensaje enviado!</h3>
        <p className="mt-2 text-slate-600">
          Gracias por contactar con nosotros. Te responderemos lo antes posible.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot: oculto para humanos, accesible solo para bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">No rellenar este campo</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => update('company', e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={inputClass}
            required
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => update('email', e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={inputClass}
          required
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Tipo de servicio */}
      <div>
        <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-slate-700">
          Tipo de servicio
        </label>
        <select
          id="service"
          value={values.service}
          onChange={(e) => update('service', e.target.value)}
          className={inputClass}
        >
          <option value="">Selecciona una opción…</option>
          {services.map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Otro">Otro / No estoy seguro</option>
        </select>
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
          Mensaje <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={inputClass}
          required
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-sm text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      {status === 'error' && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          No se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'loading' ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Enviando…
          </>
        ) : (
          'Enviar mensaje'
        )}
      </button>
    </form>
  );
}
