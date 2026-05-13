# Exploration: Project Reorganization

## Current State
- The root directory is cluttered with documentation (`prd.md`, `design.md`, `spec.md`), scripts (`scrape_rims.py`), and project files.
- The assets are organized but live in the root alongside source code.
- HTML files are in the root.

## Proposed "Correct" Structure
To align with modern standards for a static project:

### Option A: Standard Clean
```
/
  assets/
  css/
  js/
  docs/
    prd.md
    design.md
    spec.md
  scripts/
    scrape_rims.py
  *.html (root)
```
**Pros**: Minimal disruption to links. Cleans up root.
**Cons**: Still has source files mixed with assets in root.

### Option B: Professional Static (Recommended)
```
/
  src/
    assets/
    css/
    js/
    index.html
    contacto.html
    nosotros.html
    rendertry.html
  docs/
    prd.md
    design.md
    spec.md
  scripts/
    scrape_rims.py
  README.md
```
**Pros**: Very clean root. Separation of "source" from "tools/docs".
**Cons**: Requires updating ALL internal links (href, src) in all HTML/CSS files.

## Recommendation
I recommend **Option B** to set a solid foundation for future growth (e.g., adding a build step with Vite or similar).

### Impact Analysis
- **HTML**: All `<link>`, `<script>`, and `<img>` tags need updating.
- **CSS**: `url()` paths for fonts/images need updating.
- **JS**: Any relative paths for data fetching (if any) need updating.
- **Tools**: `scrape_rims.py` needs to point to the new assets location.
