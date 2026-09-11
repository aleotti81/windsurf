# Scroll Website Engine

A reusable Next.js template for editorial / luxury sites built around fullscreen
images, overlaid type and SVG mask transitions driven by scroll.

Animation and content are fully separated: the GSAP/SVG engine lives in
`components/ScrollExperience`, the site itself is just data in `data/site.ts`
plus files in `public/images/`.

Technique adapted from the Codrops article
[SVG Mask Transitions on Scroll with GSAP and ScrollTrigger](https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/)
([original demo repo](https://github.com/Hiro-kiii/Scroll-Transition)).

## Stack

Next.js (App Router) · TypeScript (strict) · React · GSAP + ScrollTrigger ·
Lenis · Tailwind CSS · modern CSS + SVG masks.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Create a new site

1. Replace `public/images/01.jpg`, `02.jpg`, `03.jpg` with your own photography
   (any name works — the paths live in the data file).
2. Edit `data/site.ts`: brand, navigation, SEO, sections, transition.
3. Nothing else. The GSAP / SVG engine never needs to be touched.

```ts
export const site: SiteConfig = {
  brand: "Happy Tuscany",
  transition: "horizontal-blinds", // | "vertical-blinds" | "random-grid"
  sections: [
    {
      id: "hero",
      image: "/images/01.jpg",
      eyebrow: "Welcome to",
      title: "Happy Tuscany",
      subtitle: "A different way to experience Tuscany",
      description: "A private house in the hills of the Valdichiana.",
      cta: { label: "Book your stay", href: "mailto:hello@example.com" },
    },
  ],
  // ...
};
```

`scripts/generate_placeholders.py` regenerates the shipped placeholder images.

## Architecture

```
app/
  layout.tsx              SEO metadata, fonts, global CSS
  page.tsx                composition only — no animation logic
  globals.css             layout, typography, reduced-motion fallback
components/
  Navigation.tsx
  ScrollExperience/
    ScrollExperience.tsx  orchestrator: Lenis, master timeline, resize, cleanup
    ScrollLayer.tsx       one fullscreen masked <svg> layer + its text
    ScrollText.tsx        eyebrow / title / subtitle / description / CTA
    ProgressBar.tsx       one segment per section, scroll-synced + clickable
    types.ts              content + configuration model
    masks/
      MaskEngine.ts       registry, responsive resolution, SVG helpers
      HorizontalBlinds.ts
      VerticalBlinds.ts
      RandomGrid.ts
data/site.ts              the whole site content
lib/animations.ts         defaults, text in/out, media queries, debounce
lib/smoothScroll.ts       Lenis ↔ ScrollTrigger wiring
public/images/
```

### Configuration

```ts
interface ScrollExperienceConfig {
  sections: ScrollSection[];
  transition: "horizontal-blinds" | "vertical-blinds" | "random-grid";
  animation?: {
    duration?: number;       // reveal length, timeline seconds
    scrub?: number;          // ScrollTrigger scrub
    stagger?: number;        // delay between mask cells
    ease?: string;
    hold?: number;           // pause between sections
    sectionScrollVh?: number; // scroll distance per section
  };
  cells?: number | { desktop: number; tablet: number; mobile: number };
}
```

`cells` overrides the mask preset (blinds count, or grid columns). Defaults:
horizontal blinds `30/20/12`, vertical blinds `12/9/6`, random grid `14/10/6`
(desktop / tablet ≤1024px / mobile ≤599px).

### Adding a transition

Implement a `MaskDefinition` in `components/ScrollExperience/masks/` and register
it in `MaskEngine.ts`:

```ts
export const myMask: MaskDefinition = {
  id: "my-mask",
  label: "My Mask",
  defaultCells: { desktop: 12, tablet: 8, mobile: 5 },
  getViewBox: ({ width, height }) => ({ width: 100, height: (height / width) * 100 }),
  build: ({ group, viewBox, cells }) => ({ reset, complete, reveal }),
};
```

A mask only creates SVG nodes inside the `<mask>` group and exposes three
operations — hidden state, revealed state, and a scrubbable reveal timeline —
so the orchestrator stays mask agnostic. `listMasks()` returns the registry,
ready to populate a transition picker in a future visual editor.

Geometry conventions kept from the original demo: virtual `0 0 100 100`-style
viewBox recomputed from the viewport aspect ratio, `preserveAspectRatio="xMidYMid slice"`
on the images, `shape-rendering="crispEdges"` on the cells, a small overlap
between cells to avoid sub-pixel gaps, and a full rebuild of masks + timeline on
(debounced) resize.

## Performance

- No React state is written during scroll: the progress bar is updated through
  refs and `transform: scaleX()`.
- Mask cells are created once per layout and re-used by the scrubbed timeline.
- GSAP timelines and ScrollTriggers are killed on resize rebuild and on unmount.
- `next/image` is intentionally **not** used for the layers: SVG masking requires
  a real `<image>` node inside the SVG document. Use it freely for any other
  image on the site.

## Accessibility

- Each layer is a `<section>` labelled by its heading; the first section owns the
  page `<h1>`.
- Layer SVGs expose `role="img"` with alt text (`imageAlt`, falling back to the
  title).
- Progress segments are real buttons: keyboard reachable and they scroll to the
  matching section.
- `prefers-reduced-motion: reduce` switches the page to a plain, fully readable
  document: no Lenis, no masks, no scrubbed timeline — just stacked fullscreen
  sections with their text visible.

## Roadmap (visual builder)

The content model is plain serialisable data and the transition registry is
introspectable, so a CMS or an editor UI only needs to produce a
`ScrollExperienceConfig`.

## License

MIT. Placeholder images are generated, not photographic assets from the original
Codrops demo.
