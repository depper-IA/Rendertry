# RENDERTRE_BRAIN_VAULT - REGLAS IMPORTANTES
## Rendertry: AI Visual Vehicle Customization Platform (Rines, Wraps, Pintura)

## 0. PROTOCOLO DE ARRANQUE PARA AGENTES IA (OBLIGATORIO)

**AL INICIAR CADA CONVERSACIÓN O SESIÓN DE TRABAJO, CADA AGENTE IA DEBE:**
1. Leer OBLIGATORIAMENTE este archivo (`REGLAS_IMPORTANTES.md` en la raíz) antes de responder cualquier pregunta o realizar cualquier modificación en el código.
2. Cumplir estrictamente con cada una de las pautas de tipografías, diseño, animaciones y arquitectura aquí documentadas.
3. El incumplimiento de estas pautas o la adición no autorizada de emojis o assets se considera un fallo de disciplina crítica de la IA.

---

## 1. REGLAS DE ORO (HARD RULES)

### Regla 0: Sin Cambios sin Autorizacion
* **No inventar**: No hacer cambios proactivos de assets, imágenes, videos o funcionalidades que no hayan sido explícitamente solicitados por el usuario.
* **Respetar límites**: No migrar frameworks, no agregar librerías externas pesadas, y no reescribir secciones funcionales desde cero si solo requieren de modificaciones puntuales de diseño o alineación.

### Regla 1: Tipografias Originales (Mandatorio)
* **Headers, Titles y Logos**: Usar estrictamente la tipografía de marca original: `'Audiowide', cursive` (definida en `--font-display`).
* **Cuerpo de Texto y UI**: Usar estrictamente `'Roboto', sans-serif` (definida en `--font-main`).
* **PROHIBICION**: Queda terminantemente prohibido usar fuentes de IA genéricas como 'Inter' o fuentes serif/monospace no aprobadas para los títulos principales.

### Regla 2: Centralizacion de Estilos (Sin Fragmentacion)
* **CSS Consolidado**: Todo el CSS global y de layout debe vivir unicamente en `apps/frontend/src/app/globals.css`.
* **PROHIBICION**: No crear archivos `.css` globales sueltos en carpetas de páginas (como `demo.css` o `contacto.css`). Esto genera fragmentación insostenible.
* **Componentes Independientes**: Únicamente se permite modularizar estilos utilizando Next.js CSS Modules (archivos `.module.css`) estrictamente vinculados a componentes reutilizables específicos (ej. `BeforeAfterSlider.module.css`).

### Regla 3: Preservacion de /contacto
* **Contacto Original**: Mantener de manera idéntica el layout de la página de contacto original (`https://rendertry.com/contacto.html`).
* **Estructura**: Grilla de dos columnas (`1fr 1.2fr` en desktop), espaciado interno de `4rem` (`padding: 4rem`), labels e inputs alineados a la izquierda.
* **Desacople de Clases**: El formulario usa la clase de estilo original `.step-card` con sus paddings y bordes intactos. Los pasos interactivos de la homepage usan exclusivamente `.step-process-card` para evitar que el centrado afecte al formulario de contacto.

### Regla 4: Fidelidad del Video Fullbleed (Hero)
* **Video de YouTube**: El video de fondo en la sección de Personalización Visual debe ser unicamente el original de YouTube (`bWlgfsU9JJk`).
* **Tiempos de Reproducción**: Debe reproducirse estrictamente desde el minuto 0:06 hasta el minuto 0:54 (`start=6&end=54`) para asegurar que cargue de forma limpia y se eviten créditos o logos ajenos a la marca. No reemplazar por archivos locales `.mp4` sin permiso.

### Regla 5: Prohibicion de Emojis (Estricta)
* **PROHIBICION**: Queda estrictamente prohibido usar emojis en cualquier interfaz de usuario, documento de reglas, archivos markdown (incluyendo este archivo), READMEs de GitHub, comentarios de codigo o mensajes de commit.
* **Solucion**: Usar siempre iconos SVG o librerías vectoriales nativas como `lucide-react`. Para documentos públicos o repositorios usar badges estáticos de shields.io.

---

## 2. REGLAS DE DESARROLLO E INGENIERÍA

### Regla 6: Refactorizacion por Tamanio de Archivo (Umbral de 600 Lineas)
* **Regla**: Cuando un archivo de código (`.ts`, `.tsx`, `.js`, `.jsx`) supere las 600 líneas de código, debe comenzar a refactorizarse en componentes o funciones utilitarias más pequeñas.
* **Criterio**: Mantener archivos menores a 600 líneas facilita lectura, testabilidad, reduce conflictos en Git y previene sobrecargas cognitivas.

### Regla 7: No Duplicacion de Codigo
* **Verificacion**: Antes de crear cualquier función, componente, endpoint, hook, servicio o utilidad, se debe buscar en el repositorio si ya existe una solución similar.
* **Criterio**: Si es idéntico, reusar el existente. Si es similar, comparar y quedarse con la mejor implementación, removiendo código muerto o redundante.

### Regla 8: Gestion Segura de Dependencias
* **Prohibicion**: Está estrictamente prohibido usar `npm install` o `npm update`. 
* **Pnpm**: Usar unicamente `pnpm@9.15.9` para evitar vulnerabilidades pre-install o inconsistencias de node_modules entre la máquina local y el contenedor del VPS.

---

## 3. PRINCIPIOS DE ANIMACIÓN Y DISEÑO (HIGH-END DESIGN)

### Deslizador Antes/Despues (Autoplay Senoidal)
* **Oscilación Senoidal**: El comparador automático debe moverse usando una onda senoidal (`Math.sin(angle)`) para crear una aceleración y desaceleración fluida en los extremos (física realista).
* **Reset de Ángulo**: Al interactuar (hover o drag), el autoplay se detiene. Al soltarlo, el ángulo debe sincronizarse matemáticamente usando arcoseno (`Math.asin`) para asegurar que el movimiento se reanude exactamente desde donde el usuario lo dejó, sin saltos bruscos.
* **Latencia Cero**: Al arrastrar de forma manual, se debe desactivar cualquier transición de CSS (`transition: none`) en el clipPath y el divisor para garantizar un rastreo instantáneo y ultra-sensible a 120Hz.

### Slider de Vehiculos Inmersivo
* **Zoom Continuo**: La imagen de fondo debe respirar constantemente con una escala lenta de `scale(1)` a `scale(1.08)` sobre 20 segundos.
* **Paralaje 3D**: Capturar coordenadas del mouse (`--smx`, `--smy`) para desplazar el fondo hacia una dirección (ej. negativa, `* -35px`) y la tarjeta de enfoque del auto en dirección opuesta (ej. positiva, `* 22px`). Esto crea un efecto inmersivo de profundidad real.
* **Autoplay Coherente**: El slider cambia automáticamente cada 6 segundos, pero el temporizador se reinicia por completo al hacer clic manual para dar tiempo al usuario de enfocar su atención.

### Diseño Bento en "Asi de Facil"
* **Alineación de Cajas**: Todas las tarjetas de pasos deben mantener perfecta simetría alineando sus cajas inferiores (zona de subida, grid de productos, caja de resultado) al fondo mediante `align-items: center` y `margin-top: auto` (o `margin: auto auto 0`).
* **Feedback de Procesamiento**: La tarjeta de resultado debe simular un análisis de inteligencia artificial activo mediante una línea láser móvil (`.result-scanline`) que barra el auto continuamente y un reflejo de vidrio (`glass sweep`) al hacer hover.
* **Disparadores de Animación**: Las tarjetas procesadoras deben conservar la clase `.step-card` de forma complementaria para que el hook de scroll (`useScrollAnimations.ts`) pueda gatillar su entrada y opacidad en el viewport de forma fluida.

---

## 4. VERIFICACIÓN TÉCNICA (PRE-FLIGHT CHECKLIST)

Antes de dar un trabajo por concluido, es mandatorio ejecutar:
1. `npx tsc --noEmit` en la carpeta `apps/frontend` para garantizar compilación exitosa y cero errores de tipado de TypeScript.
2. Comprobar que no existan clases CSS duplicadas o sobreescritas accidentalmente en `globals.css` que alteren layouts globales.

---
*Vincular este archivo al contexto de la sesión actual de forma permanente.*
<!-- engram-topic: architecture/important-rules -->