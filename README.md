# Pinturas Ramón — Web corporativa

Web corporativa para una pequeña empresa de pintura, construida con **Astro + TypeScript**,
**React** (solo para componentes interactivos), **Tailwind CSS** y salida **estática (SSG)**.

## ✨ Características

- 🎨 **Home** con hero, servicios, galería con lightbox, "sobre nosotros" y testimonios.
- 📄 **Páginas**: Inicio, Servicios (catálogo detallado) y Contacto.
- 📝 **Formulario de contacto** (React) con validación, estados de envío, honeypot anti-spam
  y destino **configurable** (Formspree o endpoint propio con Resend).
- 💬 **WhatsApp**: botón flotante en todas las páginas + enlaces en hero y contacto,
  usando el enlace oficial `wa.me` con mensaje precargado.
- 🔍 **SEO**: meta tags, Open Graph, Twitter Card, sitemap, `robots.txt` y datos
  estructurados JSON-LD de tipo `LocalBusiness`.
- ♿ **Accesibilidad y rendimiento**: HTML semántico, navegación por teclado, imágenes
  optimizadas con `<Image>` y carga diferida.

## 🗂️ Estructura

```
src/
  assets/        Imágenes (placeholders — sustitúyelas por las tuyas)
  components/    Componentes .astro (estáticos) y .tsx (React, interactivos)
  data/          ⭐ Datos editables: site.ts, services.ts, reviews.ts, gallery.ts
  layouts/       Layout base
  pages/         Rutas: index, servicios, contacto, api/contact, 404
  styles/        global.css (Tailwind + paleta configurable)
public/          robots.txt, favicons
```

## 🚀 Instalación

Requisitos: **Node ≥ 22.12** (probado con Node 26).

```bash
npm install
cp .env.example .env   # rellena tus variables
npm run dev            # http://localhost:4321
```

> Según `CLAUDE.md`, puedes lanzar el servidor en segundo plano con
> `astro dev --background` y gestionarlo con `astro dev stop|status|logs`.

## ⚙️ Personalización

Casi todo se edita desde **`src/data/`** sin tocar componentes:

| Archivo                | Qué contiene                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `src/data/site.ts`     | Nombre, eslogan, teléfono, email, **WhatsApp**, dirección, horario, redes |
| `src/data/services.ts` | Lista de servicios (alimenta home, página de servicios y el `<select>`)  |
| `src/data/reviews.ts`  | Testimonios (nombre, localidad, estrellas, texto)                        |
| `src/data/gallery.ts`  | Imágenes de la galería (importadas desde `src/assets`)                   |

- **Paleta de colores y tipografía**: bloque `@theme` en `src/styles/global.css`.
- **Dominio**: cambia `site` en `astro.config.mjs` y la URL del `Sitemap:` en `public/robots.txt`.
- **Imágenes**: reemplaza los `.jpg` de `src/assets/` manteniendo los nombres/imports.

## ✉️ Formulario de contacto

El destino se elige con la variable `PUBLIC_CONTACT_PROVIDER`:

### Opción A — Formspree (recomendada, 100 % estática)

No requiere adapter ni servidor. En `.env`:

```env
PUBLIC_CONTACT_PROVIDER=formspree
PUBLIC_FORMSPREE_ID=xxxxxxxx   # ID de tu formulario en https://formspree.io
```

Si solo usas Formspree, puedes simplificar el proyecto eliminando el adapter:
quita `adapter: vercel()` y su import en `astro.config.mjs`, y borra `src/pages/api/contact.ts`.

### Opción B — Resend (endpoint serverless propio)

Envía un email desde `/api/contact`. Requiere el adapter de Vercel (ya configurado). En `.env`:

```env
PUBLIC_CONTACT_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxx          # https://resend.com/api-keys
CONTACT_TO_EMAIL=info@pinturasramon.es
```

> En `src/pages/api/contact.ts`, cambia el remitente `from:` por un dominio verificado
> en Resend (para pruebas sirve `onboarding@resend.dev`).

## 📦 Build y despliegue

```bash
npm run build     # genera /dist (+ sitemap)
npm run preview   # previsualiza el build
```

### Desplegar en Vercel

1. Sube el repo a GitHub e impórtalo en [Vercel](https://vercel.com/new).
   Vercel detecta Astro automáticamente.
2. En **Settings → Environment Variables** añade las variables de tu `.env`
   (`PUBLIC_CONTACT_PROVIDER`, `PUBLIC_FORMSPREE_ID` y, si usas Resend,
   `RESEND_API_KEY` y `CONTACT_TO_EMAIL`).
3. Deploy. El endpoint `/api/contact` se publica como función serverless gracias al
   adapter `@astrojs/vercel`.

> **Solo Formspree / hosting estático** (Netlify, Cloudflare Pages, GitHub Pages…):
> elimina el adapter como se indica arriba y sube la carpeta `dist/` (o conecta el repo).
> No necesitas variables de servidor.
