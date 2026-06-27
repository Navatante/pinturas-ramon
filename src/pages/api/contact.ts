/**
 * Endpoint serverless para enviar el formulario de contacto por email con Resend.
 *
 * Solo se usa cuando PUBLIC_CONTACT_PROVIDER = 'resend'. Si te quedas con
 * Formspree, este archivo es inofensivo (no se invoca) y puedes borrarlo.
 *
 * Variables de entorno necesarias (NO se exponen al cliente, no llevan PUBLIC_):
 *   RESEND_API_KEY    👉 tu clave de Resend (https://resend.com/api-keys)
 *   CONTACT_TO_EMAIL  👉 dirección que recibirá los avisos
 *
 * Configúralas en un archivo .env (local) y en el panel de Vercel (producción).
 */
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Esta ruta se renderiza bajo demanda (función serverless), no en build.
export const prerender = false;

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  company?: string; // honeypot
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  // Anti-spam: si el honeypot viene relleno, fingimos éxito y descartamos.
  if (data.company) return json({ ok: true }, 200);

  // Validación en servidor (no confiar solo en el cliente).
  if (!data.name?.trim() || !data.message?.trim() || !data.email || !EMAIL_RE.test(data.email)) {
    return json({ error: 'Campos obligatorios incompletos o email no válido' }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error('Faltan RESEND_API_KEY o CONTACT_TO_EMAIL en el entorno');
    return json({ error: 'Configuración de email incompleta' }, 500);
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      // 👉 Cambia "from" por un dominio verificado en Resend.
      //    Mientras pruebas puedes usar 'onboarding@resend.dev'.
      from: 'Pinturas Ramón <onboarding@resend.dev>',
      to: [to],
      replyTo: data.email,
      subject: `Nuevo presupuesto de ${data.name}`,
      text: [
        `Nombre: ${data.name}`,
        `Email: ${data.email}`,
        `Teléfono: ${data.phone || '—'}`,
        `Servicio: ${data.service || '—'}`,
        '',
        'Mensaje:',
        data.message,
      ].join('\n'),
    });

    if (error) {
      console.error('Resend error:', error);
      return json({ error: 'No se pudo enviar el email' }, 502);
    }

    return json({ ok: true }, 200);
  } catch (err) {
    console.error('Error inesperado al enviar email:', err);
    return json({ error: 'Error interno' }, 500);
  }
};
