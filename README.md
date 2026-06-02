# Rendertry Landing Page

> **Legacy landing page** — HTML/CSS vanilla implementation. See [rendertry-backend](https://github.com/depper-IA/rendertry-backend) for the full Next.js 14 application.

<br />

## Stack Tecnológico

<img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
<img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
<img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" />

<br />

## Descripción

Landing page estática para **Rendertry** — plataforma web que ofrece una experiencia inmersiva para previsualizar modificaciones vehiculares.

> **Nota:** Este repositorio contiene la landing page legacy. El desarrollo activo continúa en el monorepo [rendertry-backend](https://github.com/depper-IA/rendertry-backend).

<br />

## Empezando

```bash
# Node.js
npx serve src

# Python
python -m http.server 8080 -d src
```

Abre `http://localhost:8080` en tu navegador.

<br />

## Estructura del Proyecto

```text
Rendertry-OR/
├── src/
│   ├── assets/         # Imágenes, iconos, logos
│   ├── css/            # Estilos del proyecto
│   │   ├── components/ # Módulos CSS
│   │   ├── base.css    # Variables y resets
│   │   └── main.css    # Archivo central
│   ├── js/             # JavaScript
│   │   └── rendertry-widget.js  # Widget embeddable
│   ├── partials/       # Componentes HTML
│   ├── index.html      # Landing page principal
│   ├── contacto.html   # Página de contacto
│   └── nosotros.html   # Página sobre nosotros
└── README.md
```

<br />

## Características

- Banner principal inmersivo con visualización vehicular
- Widget embeddable `rendertry-widget.js` para integración externa
- UI/UX en Dark Mode con acentos Racing Red
- Diseño 100% responsive
- Animaciones fluidas y menús interactivos

<br />

## Integración del Widget

Para嵌入 el widget de visualización en cualquier sitio:

```html
<div id="rendertry-widget" data-vehicle="bmw-m4"></div>
<script src="https://tu-dominio.com/js/rendertry-widget.js"></script>
```

<br />

## Enlaces

- **Monorepo (desarrollo activo):** https://github.com/depper-IA/rendertry-backend
- **Landing page:** https://github.com/depper-IA/Rendertry

<br />

<div align="center">
  <br>
  <p>Construido con pasión para entusiastas del motor.</p>
  <p>&copy; Rendertry. Todos los derechos reservados.</p>
</div>