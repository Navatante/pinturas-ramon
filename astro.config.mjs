// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // URL canónica del sitio: imprescindible para sitemap, canonical y Open Graph.
  // 👉 Cámbiala por tu dominio real antes de desplegar.
  site: 'https://pinturasramon.es',

  // Salida estática (SSG) por defecto. Solo la ruta /api/contact se renderiza
  // bajo demanda (marca `export const prerender = false` en ese archivo),
  // y el adapter de Vercel la convierte en una función serverless.
  output: 'static',

  // Adapter de Vercel. Necesario únicamente si usas el endpoint Resend.
  // Si te quedas solo con Formspree (estático puro), puedes eliminar esta línea
  // y la importación de arriba.
  adapter: vercel(),

  integrations: [
    react(), // componentes interactivos (galería, testimonios, formulario)
    sitemap(), // genera /sitemap-index.xml automáticamente
  ],

  vite: {
    // Tailwind CSS v4 se integra como plugin de Vite.
    plugins: [tailwindcss()],
  },
});
