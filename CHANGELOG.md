# Changelog

All notable changes to Arcane.io are documented here.

## [1.0.0] - 2026-10-15

### Initial Release

#### Core Application
- Built a procedural sigil and esoteric circle design tool with real-time SVG canvas rendering
- Implemented 5 layer types: Ring (concentric circles with golden-ratio/Fibonacci spacing), Polygon (3-12 sided shapes), Axis/Spokes (radial line patterns), Text Ring (circular text via SVG textPath), and Center Spine (vertical sigil-anchor nodes in the style of John Dee's Monas Hieroglyphica)
- Created 4 narrative archetype presets: Transmutation & Change (interlocking triangles with Sulfur/Mercury/Salt rings), Celestial & Astrological Alignment (12-house axes with Zodiac text ring), Binding & Containment (heavy octagon with boundary rings), and Sacred Geometric Resonance (golden-ratio nested rings with hexagonal flower-of-life)
- Built a glyph injection system with 10 hardcoded alchemical/astrological symbols (Fire, Water, Air, Earth, Sulfur, Mercury, Salt, Sun, Moon, Earth/Antimony) that can be stamped at the center, polygon vertices, or axis-ring intersections
- Implemented SVG and PNG export (2x resolution PNG with transparent background, standalone SVG for laser cutting/engraving)
- All rendering is client-side with no backend dependency

#### Theme System
- Created a centralized CSS-variable-based theme system in `src/esoteric/theme.ts`
- Shipped 5 built-in themes: Grimoire Dark (default), Parchment Light, Void Black, Alchemy Gold, Abyss Indigo
- Added a palette icon in the header for instant live theme switching
- All component colors reference CSS variables, so editing a single theme file restyles the entire application

#### Knowledge & Lore System
- Created a comprehensive knowledge database in `src/esoteric/knowledge.ts` with alchemical/astrological lore for every glyph, layer type, layer property, placement mode, archetype, and export format
- Built a reusable Tooltip component (`src/components/Tooltip.tsx`) that auto-positions and renders on hover or tap
- Added info-icon tooltips to every control in the sidebar and layer editor -- no property is unlabeled
- Built a searchable Grimoire panel (`src/components/GrimoirePanel.tsx`) accessible via a book icon in the header, with real-time search filtering across all knowledge entries organized into collapsible accordion sections
- Archetype entries in the Grimoire panel include an "Apply" button that loads that preset onto the canvas

#### PWA (Progressive Web App) Support
- Added a web manifest (`public/manifest.json`) with app name, icons, standalone display mode, and theme color
- Implemented a service worker (`public/sw.js`) for offline caching -- the entire app works with no internet connection after first load
- Generated app icons at 192px, 512px (maskable), and 180px (Apple touch icon) from a sigil-style SVG mark
- Added Apple-specific meta tags in `index.html` for iOS fullscreen launch, status bar styling, and home screen icon
- Built an install button in the header that appears on supported browsers (Android Chrome, Edge, etc.) and triggers the native install prompt
- On iOS, the install button instead shows a tooltip guiding users to tap Share then "Add to Home Screen"
- The install button hides automatically once the app is installed
- Service worker registration is handled in `index.html` with graceful fallback

#### Portable Build Configuration
- Set `base: './'` in Vite config so the production build works from any directory, domain, or subdirectory with no server required
- The `dist/` output is fully self-contained static files (HTML, CSS, JS, icons, manifest, service worker) and can be deployed to Netlify, Vercel, GitHub Pages, S3, or any static host with zero configuration
- The same build can be wrapped in Electron or Tauri for desktop apps, or Capacitor for iOS/Android app store distribution

#### Technical Stack
- React 18 with TypeScript
- Vite 5 for build tooling
- Tailwind CSS 3 with CSS-variable theming
- Lucide React for icons
- No runtime backend dependency (Supabase package present but unused by core app)
