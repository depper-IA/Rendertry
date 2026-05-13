# DESIGN — Guía de Diseño y Branding
## Rendertry — Sistema de Diseño v3.0 (Dark Mode — Racing Red)

---

> [!IMPORTANT]
> ## 🔴 REGLA OBLIGATORIA PARA EL AGENTE
> **ANTES de crear cualquier sección nueva o hacer cambios en el proyecto, se DEBEN leer los archivos:**
> - `docs/spec.md` — Especificaciones técnicas, stack y breakpoints
> - `prd.md` — Objetivos, usuarios, funcionalidades y restricciones
> - `docs/design.md` — Este archivo: branding, colores, tipografía y componentes
>
> **No hacer esto resultará en inconsistencias con el proyecto. Sin excepciones.**

---

## 1. Identidad de Marca

| Atributo | Valor |
|----------|-------|
| **Nombre del sitio** | **Rendertry** |
| Tagline | *Tu auto, tu visión.* |
| Personalidad | Futurista, premium, técnico |
| Tono | Directo, profesional e innovador |
| Sector | Automotriz / Visualización IA |

---

## 2. Logo — Reglas de Uso

### 2.1 Composición del Logo

El logo de Rendertry tiene **tres elementos obligatorios**, en este orden:

| Elemento | Color | Notas |
|----------|-------|-------|
| Ícono `aperture` (Lucide) | `var(--primary)` = `#e63946` (Racing Red) | 24px en nav, 28px en footer |
| Palabra **"RENDER"** | `var(--primary)` = `#e63946` (Racing Red) | Font-weight: 800, uppercase |
| Palabra **"TRY"** | `#ffffff` (Blanco puro) | Font-weight: 800, uppercase |

### 2.2 Implementación HTML

```html
<!-- Uso estándar en nav -->
<a href="index.html" class="logo">
  <i data-lucide="aperture" style="width:24px;height:24px; color:var(--primary);"></i>
  <span class="logo-render">RENDER</span><span class="logo-try">TRY</span>
</a>

<!-- Uso en footer -->
<a href="index.html" class="logo footer-logo">
  <i data-lucide="aperture" style="width:28px;height:28px; color:var(--primary);"></i>
  <span class="logo-render">RENDER</span><span class="logo-try">TRY</span>
</a>
```

### 2.3 CSS del Logo

```css
.logo-render {
  color: var(--primary);
  font-weight: 800;
}
.logo-try {
  color: #ffffff;
  font-weight: 800;
}
```

### 2.4 Restricciones

- ❌ NUNCA usar el nombre "StreetTuning" en ningún archivo
- ❌ NUNCA separar el ícono del texto del logo
- ❌ NUNCA cambiar los colores de "RENDER" o "TRY" por otros
- ✅ El ícono SIEMPRE va primero, a la izquierda del texto

---

## 3. Paleta de Colores

### 3.1 Variables CSS (Design Tokens — Dark Mode)

```css
:root {
  /* Fondos */
  --bg-dark: #0a0c10;          /* Deep Obsidian — fondo general */
  --bg-card: #11151c;          /* Surface Card — tarjetas y componentes */
  --bg-card-hover: #1a1f29;    /* Hover de tarjetas */

  /* Marca */
  --primary: #e63946;          /* Racing Red — CTA y branding */
  --primary-hover: #b91c2c;    /* Shadow Red — hover de primario */
  --secondary: #ffb347;        /* Warm Gold — acentos y micro-interacciones */
  --accent-glow: rgba(230, 57, 70, 0.3);

  /* Texto */
  --text-main: #f0f3f8;        /* Alto contraste — títulos */
  --text-muted: #9aa3b5;       /* Bajo contraste — descripciones */

  /* Estructura */
  --border-color: #1e293b;
  --glass: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);

  /* Tipografía */
  --font-main: 'Inter', sans-serif;
  --font-display: 'Inter', sans-serif;
}
```

### 3.2 Tabla de Colores

| Nombre | Hex | Uso |
|--------|-----|-----|
| Racing Red | `#e63946` | Logo "RENDER", botones CTA, íconos activos |
| Shadow Red | `#b91c2c` | Hover de botones primarios |
| Warm Gold | `#ffb347` | Acentos, micro-interacciones, highlights |
| Deep Obsidian | `#0a0c10` | Fondo general |
| Surface Card | `#11151c` | Fondo de tarjetas |
| Text Light | `#f0f3f8` | Texto principal |
| Text Muted | `#9aa3b5` | Texto secundario |
| Logo "TRY" | `#ffffff` | Solo para la segunda parte del wordmark |

---

## 4. Tipografía

### 4.1 Fuente Única: Inter

| Rol | Fuente | Peso | Uso |
|-----|--------|------|-----|
| Cuerpo (Main) | **Inter** | 300, 400, 500, 700 | Todo el cuerpo de texto |
| Titulares (Display) | **Inter** | 700, 800 | Títulos h1–h3, sec-title |
| Botones | **Inter** | 700 | CTAs y botones |
| Logo | **Inter** | 800 | Wordmark RENDERTRY |

**Import de Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
```

### 4.2 Estilos Tipográficos

- **Titulares:** `letter-spacing: -0.02em`, `font-weight: 700–800`
- **Textos secundarios:** Inter 300–400, `color: var(--text-muted)`
- **NO** usar `text-transform: uppercase` en titulares principales (solo en etiquetas y badges)

---

## 5. Navegación — Megamenu

### 5.1 Estructura del Megamenu

El nav tiene **dos grupos** + un CTA a la derecha:

**Grupo "Plataforma"** (trigger con dropdown):
- Cómo funciona → `#proceso`
- Galería → `#galeria`
- Funcionalidades → `#funcionalidades`
- Precios → `#precios`
- Comparador → `#ba-section`

**Grupo "Empresa"** (trigger con dropdown):
- Nosotros → `nosotros.html`
- Contacto → `contacto.html`

**CTA:** Botón "Probar gratis" → `contacto.html`

### 5.2 Comportamiento

- Fixed top con `backdrop-filter: blur(20px)`
- Comprime padding al hacer scroll > 60px
- Mobile: hamburger menu, full-width drawer
- Megamenu: aparece en hover/focus con transición suave
- El link activo recibe `color: var(--primary)` + `border-bottom: 2px solid var(--primary)`

---

## 6. Componentes UI

### 6.1 Botones

**Primario (.btn-primary):**
- Fondo: `linear-gradient(135deg, var(--primary), var(--secondary))`
- Texto: blanco, Inter 700, uppercase
- Sombra: `0 4px 15px var(--accent-glow)`
- Hover: `translateY(-2px)`, sombra ampliada

**Ghost (.btn-ghost):**
- Fondo: `var(--glass)` translúcido
- Borde: `1px solid var(--glass-border)`
- Hover: borde rojo, fondo ligeramente tintado

### 6.2 Cards

- Fondo: `var(--bg-card)` = `#11151c`
- Borde: `1px solid var(--border-color)` = `#1e293b`
- Border-radius: `12px`–`16px`
- Hover: `border-color: var(--primary)` + `box-shadow` suave

---

## 7. Animaciones

- Motion One (CDN) para animaciones de entrada progresiva (stagger)
- Scroll: `IntersectionObserver` con `threshold: 0.1`
- Duración estándar: `0.6s`–`0.8s`
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`

---

## 8. Responsive — Breakpoints

| Breakpoint | Ancho | Notas |
|-----------|-------|-------|
| Mobile | < 768px | Nav colapsa a hamburger, hero en columna única |
| Tablet | 768px–992px | Grid de 2 columnas en steps |
| Desktop | > 992px | Layout completo, megamenu visible |
| Wide | > 1440px | Container máximo activo |
