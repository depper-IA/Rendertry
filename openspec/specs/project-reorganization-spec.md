# Spec: Project Reorganization

## Requirements
- **R1**: All documentation files (`.md` files except README) MUST be located in the `docs/` directory.
- **R2**: All utility scripts (e.g., `.py` files) MUST be located in the `scripts/` directory.
- **R3**: All website source code (HTML, CSS, JS, Assets) MUST be located in the `src/` directory.
- **R4**: The project root MUST contain only essential configuration files and the new directory structure.
- **R5**: The website MUST remain fully functional after reorganization, with all links and assets resolving correctly.
- **R6**: The project MUST use the "StreetTuning" color palette (Racing Red, Deep Obsidian, Warm Gold) defined in the design documentation.

## Scenarios

### Scenario 1: Accessing Documentation
- **Given** I am in the project root
- **When** I look for the PRD or Design guide
- **Then** I should find them inside the `docs/` folder.

### Scenario 2: Website Navigation
- **Given** the new project structure
- **When** I open `src/index.html` in a browser
- **Then** all CSS, JS, and images should load correctly, and navigation links should work between pages.
