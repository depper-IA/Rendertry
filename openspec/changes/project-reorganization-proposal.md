# Proposal: Project Reorganization

## Goal
Organize the project structure to separate documentation, scripts, and source code, following modern web development standards.

## Scope
- Create `src/`, `docs/`, and `scripts/` directories.
- Move documentation files (`prd.md`, `design.md`, `spec.md`) to `docs/`.
- Move utility scripts (`scrape_rims.py`) to `scripts/`.
- Move all web source files (`index.html`, `contacto.html`, `nosotros.html`, `rendertry.html`, `css/`, `js/`, `assets/`) to `src/`.
- Update all internal links to maintain functionality.

## Approach
1. **Infrastructure**: Create the new directory structure.
2. **Migration**: Move files to their respective locations.
3. **Refactoring**: Update paths in HTML, CSS, and JS files.
4. **Verification**: Check that the site still renders correctly and links are functional.

## Rollback Plan
Since this is a file movement task, rollback involves moving files back to their original positions. No destructive changes are planned.
