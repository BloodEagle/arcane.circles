# arcane.circles

A procedural sigil and esoteric circle design tool. Build alchemical circles, sacred geometry, and astrological charts in real time, then export as SVG or PNG.

## Features

- **5 Layer Types**: Rings (with golden-ratio/Fibonacci spacing), Polygons (3-12 sides), Axis/Spokes, Circular Text Rings, and Center Spine with glyph-anchor nodes
- **4 Narrative Archetypes**: Transmutation, Celestial, Binding, and Sacred Geometry presets
- **10 Alchemical Glyphs**: Fire, Water, Air, Earth, Sulfur, Mercury, Salt, Sun, Moon, and Earth/Antimony -- stampable at center, vertices, or intersections
- **5 Built-in Themes**: Grimoire Dark, Parchment Light, Void Black, Alchemy Gold, Abyss Indigo -- switch instantly from the header
- **Searchable Grimoire**: In-app reference panel with lore for every glyph, layer type, property, and archetype
- **Inline Tooltips**: Every control has an info icon with a detailed explanation
- **Export**: SVG (vector, laser-cutter ready) and PNG (2x resolution, transparent background)
- **PWA Installable**: Works offline, installs to phone/desktop home screen
- **No Backend Required**: Fully self-contained static build

## Getting Started

```bash
npm install
npm run dev      # development server
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Deployment

The `dist/` folder contains fully static files. Upload to any static host:

- **Netlify / Vercel / Cloudflare Pages**: Drag and drop the `dist/` folder
- **GitHub Pages**: Push `dist/` contents to a `gh-pages` branch
- **Desktop app**: Wrap `dist/` in Electron or Tauri
- **Mobile app**: Wrap `dist/` in Capacitor for iOS/Android

No server or database is required.

## Theming

All colors are defined as CSS variables in `src/esoteric/theme.ts`. Edit a theme's color values or add a new theme object to restyle the entire application. Switch themes live from the palette icon in the header.

## Tech Stack

React 18, TypeScript, Vite 5, Tailwind CSS 3, Lucide React

## License

MIT
