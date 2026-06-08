<div align="center">
  <img src="https://raw.githubusercontent.com/depper-IA/Rendertry/main/public/assets/logos/logo.png" alt="Rendertry Logo" width="120"/>
  <h1>Rendertry</h1>
  <p><strong>Visualizador de Personalización Automotriz con IA</strong></p>

  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black" alt="GSAP" />
</div>

<br />

> **Rendertry** permite visualizar la personalización de un vehículo sobre su foto real. El usuario sube una imagen, elige rines, pintura o wraps, y la IA genera el resultado en segundos. Gratis y sin registro.

> **¿Buscas la plataforma completa?** El producto full-stack (dashboard de administración, autenticación, pagos, suscripciones y APIs internas) vive en el repositorio privado `depper-IA/rendertry-backend`. Este repositorio contiene únicamente el **sitio público**.

---

## Alcance de este repositorio

Versión pública del sitio. Incluye solo las rutas de cara al usuario:

| Ruta | Descripción |
|------|-------------|
| `/` | Landing principal: hero animado, proceso, galería, comparador, planes |
| `/nosotros` | Página del equipo, misión y forma de trabajo |
| `/contacto` | Formulario de contacto y datos de la empresa |
| `/demo` | Demo interactiva del widget de personalización |

Las áreas privadas (dashboard, login, registro, pagos, suscripciones y autenticación) no forman parte de este repositorio.

---

## Características

- **Hero con video scroll-scrubbed** sincronizado al desplazamiento mediante GSAP.
- **Comparador Antes/Después** con física de oscilación senoidal.
- **Slider de vehículos 3D** con paralaje y zoom continuo.
- **Marquee de marcas y de texto** en color de marca.
- **SEO completo**: Open Graph, Twitter Cards, `robots.txt`, `sitemap.xml`, datos estructurados JSON-LD, `og-image` y `llms.txt`.
- **Diseño responsivo** (escritorio, tablet y móvil) en dark mode con acentos Racing Red.
- **Rendimiento**: imágenes optimizadas, lazy loading y carga diferida del hero.

---

## Stack

- **Framework:** Next.js 14 (App Router, `output: standalone`)
- **Lenguaje:** TypeScript 5
- **Estilos:** CSS con variables, centralizado en `src/app/globals.css` (sin Tailwind)
- **Animación:** GSAP (hero) + Motion / Framer Motion (scroll) + Lenis (smooth scroll)
- **Iconos:** Lucide React
- **Datos:** Supabase (cliente para el demo)
- **Tipografías:** Audiowide (display) + Roboto (texto)

---

## Estructura del proyecto

```text
Rendertry/
├── public/
│   └── assets/                 # Logos, imágenes, video del hero, og-image
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout raíz: fuentes, metadata y SEO
│   │   ├── page.tsx            # Landing (home)
│   │   ├── globals.css         # Sistema de estilos central
│   │   ├── robots.ts           # robots.txt dinámico
│   │   ├── sitemap.ts          # sitemap.xml dinámico
│   │   ├── (public)/
│   │   │   ├── components/      # Hero GSAP + secciones de la landing
│   │   │   ├── nosotros/        # Página Nosotros (+ metadata)
│   │   │   ├── contacto/        # Página Contacto (+ metadata)
│   │   │   └── demo/            # Demo del widget
│   │   └── api/
│   │       ├── pruebalo/        # Generación por IA (incluye modo demo)
│   │       └── products/        # Catálogo de productos
│   ├── components/              # Navbar, Footer, Widget, BeforeAfterSlider...
│   ├── config/                 # Cliente de Supabase
│   ├── hooks/                  # Hooks de animación de scroll
│   └── lib/                    # Utilidades
├── scripts/                    # Optimización de imágenes, limpieza de build
└── README.md
```

---

## Desarrollo

Requiere **Node.js 18+** y **pnpm** (no usar npm ni yarn).

```bash
pnpm install      # instalar dependencias
pnpm dev          # servidor de desarrollo en http://localhost:3000
pnpm build        # build de producción (standalone)
pnpm start        # servir el build de producción
pnpm lint         # ESLint
pnpm typecheck    # comprobación de tipos (tsc --noEmit)
```

### Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores. Las claves de Supabase y la URL pública del sitio (`NEXT_PUBLIC_APP_URL`) son las relevantes para esta versión. El proyecto compila sin una conexión activa a Supabase.

---

<div align="center">
  <br>
  <p>Construido para entusiastas del motor.</p>
  <p>&copy; 2026 Rendertry. Todos los derechos reservados.</p>
</div>
