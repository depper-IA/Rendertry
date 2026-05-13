# SPEC — Especificaciones Técnicas
## Rendertry — Visualizador de Personalización Automotriz

### 1. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Estructura | HTML5 semántico | — |
| Estilos | CSS3 + Variables CSS | — |
| Framework UI | Bootstrap (grid + utilidades) | 5.3.3 |
| Iconos | Lucide Icons | latest |
| Tipografía | Google Fonts — Inter | Variable |
| Animaciones | CSS Keyframes + IntersectionObserver | — |
| JavaScript | Vanilla JS (ES6+) | — |

---

### 2. Estructura de Archivos

```
rendertry/
├── index.html          # Página principal
├── prd.md              # Product Requirements Document
├── spec.md             # Especificaciones técnicas (este archivo)
├── design.md           # Guía de diseño y branding
├── css/
│   └── estilos.css     # Hoja de estilos principal
└── assets/
    ├── gallery-ferrari.jpg   # Hero principal
    ├── rim1.png              # Rin generado (placeholder)
    ├── rim2.png              # Rin generado (placeholder)
    ├── gallery-*.jpg         # Galería de vehículos
    ├── cta-bg.jpg            # Fondo del CTA final
    └── slider/
        ├── porsche.jpg       # Slide 1
        ├── bmw.jpg           # Slide 2
        ├── mercedes_benz.jpg # Slide 3
        └── camioneta.jpeg    # Slide 4
```

---

### 3. Arquitectura de Componentes

#### 3.1 Navegación
- **Tipo:** Fixed top nav con `backdrop-filter: blur`
- **Comportamiento:** Se comprime (`padding` reduce) al hacer scroll > 60px
- **Mobile:** Menú hamburguesa con toggle JS, oculta `nav-links`

#### 3.2 Hero Section
- **Layout:** 2 columnas Bootstrap (`col-lg-6`)
- **Izquierda:** Título + subtítulo + CTAs
- **Derecha:** `.interactive-preview` con imagen del Ferrari + `.rim-selector` flotante horizontal en la parte inferior
- **Fondo:** Gradiente radial sutil azul

#### 3.3 Marquee
- **Técnica:** CSS `animation: marquee` duplicado para loop infinito
- **Contenido:** 8 items de texto con iconos Lucide

#### 3.4 Slider Banner
- **Slides:** 4 (Porsche, BMW, Mercedes, Camioneta)
- **Navegación:** Botones prev/next + dots indicadores
- **Autoplay:** `setInterval` cada 5000ms, pausado al click manual
- **Animación:** `fadeSlide` CSS keyframe (opacity + translateX)

#### 3.5 Galería
- **Layout:** CSS Grid (`2fr 1fr`, 2 filas de 320px)
- **Efectos:** `scale(1.06)` + `brightness` al hover
- **Responsive:** Colapsa a 1 columna en mobile

#### 3.6 Animaciones de Scroll
- **API:** `IntersectionObserver` con `threshold: 0.1`
- **Elementos animados:** `.step-card`, `.feat-cell`, `.gallery-item`, `.story-card`, `.audience-cell`
- **Clases:** `.animate-hidden` (inicial) → `.animate-in` (al entrar en viewport)

---

### 4. Variables CSS (Design Tokens)

```css
:root {
  /* Colores */
  --bg-dark: #f8fafc;        /* Fondo base */
  --bg-card: #ffffff;         /* Fondo de tarjetas */
  --bg-card-hover: #f1f5f9;  /* Hover de tarjetas */
  --blue: #2563eb;            /* Acento principal */
  --blue-hover: #1d4ed8;      /* Hover del acento */
  --blue-soft: rgba(37,99,235,0.10); /* Fondo suave de acento */
  --text-main: #0f172a;       /* Texto principal */
  --text-muted: #64748b;      /* Texto secundario */
  --border-color: #e2e8f0;   /* Bordes */

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08);

  /* Tipografía */
  --font-main: 'Inter', sans-serif;
}
```

---

### 5. Breakpoints Responsive

| Breakpoint | Ancho | Cambios |
|-----------|-------|---------|
| Mobile | < 768px | Nav colapsa, hero stack, slider columna, galería 1col |
| Tablet | 768px–992px | Steps en columna, grid 2col |
| Desktop | > 992px | Layout completo |
| Wide | > 1440px | Container máximo activo |

---

### 6. Performance y Accesibilidad
- Imágenes locales en `assets/` (sin requests externos)
- Fuentes de Google Fonts con `display=swap`
- `prefers-reduced-motion`: las animaciones de scroll usan `transition`, respetan la preferencia del sistema
- Semántica HTML5: `<nav>`, `<section>`, `<main>`, `<footer>`
- Alt text en todas las imágenes
- Focus states visibles para navegación por teclado
- Contraste de texto mínimo 4.5:1 (texto oscuro sobre fondo claro)
