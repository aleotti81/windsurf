/**
 * Public content + configuration model of the Scroll Website Engine.
 *
 * Everything in this file is plain data: it can be authored by hand in
 * `data/site.ts`, returned by a CMS, or produced by a future visual editor.
 */

export interface ScrollCta {
  label: string;
  href: string;
}

export interface ScrollSection {
  id: string;
  /** Path (or absolute URL) of the fullscreen image, e.g. `/images/01.jpg`. */
  image: string;
  /** Alt text for the image. Falls back to the title when omitted. */
  imageAlt?: string;
  title: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  cta?: ScrollCta;
}

export type TransitionId =
  | "horizontal-blinds"
  | "vertical-blinds"
  | "random-grid";

/**
 * A value that can be tuned per breakpoint. A plain number applies everywhere.
 */
export type ResponsiveValue =
  | number
  | {
      desktop: number;
      tablet: number;
      mobile: number;
    };

export interface ScrollAnimationConfig {
  /** Duration (in timeline seconds) of a single layer reveal. */
  duration?: number;
  /** ScrollTrigger scrub value. */
  scrub?: number;
  /** Delay between two mask cells. */
  stagger?: number;
  ease?: string;
  /** Pause between two sections, in timeline seconds. */
  hold?: number;
  /** Scroll length allocated to each section, in viewport heights. */
  sectionScrollVh?: number;
}

export interface ScrollExperienceConfig {
  sections: ScrollSection[];
  transition: TransitionId;
  animation?: ScrollAnimationConfig;
  /**
   * Number of mask cells (blinds count, or grid columns) per breakpoint.
   * Defaults to the mask's own responsive preset.
   */
  cells?: ResponsiveValue;
}

export interface Viewport {
  width: number;
  height: number;
}

/** Virtual SVG viewBox: one axis is always 100 units. */
export interface ViewBox {
  width: number;
  height: number;
}

export interface MaskAnimationSettings {
  duration: number;
  stagger: number;
  ease: string;
}

export interface MaskBuildContext {
  /** `<g>` living inside the layer `<mask>`; already emptied by the engine. */
  group: SVGGElement;
  viewBox: ViewBox;
  viewport: Viewport;
  /** Resolved cell count for the current breakpoint. */
  cells: number;
}

export interface MaskInstance {
  /** Hidden state: the layer underneath shows through. */
  reset: () => void;
  /** Fully revealed state, applied without animation. */
  complete: () => void;
  /** Scroll-driven reveal of the layer. */
  reveal: (settings: MaskAnimationSettings) => gsap.core.Timeline;
}

export interface MaskDefinition {
  id: TransitionId;
  label: string;
  /** Cell count preset used when the config does not override it. */
  defaultCells: ResponsiveValue;
  /**
   * Virtual viewBox for the current viewport. Keeping one axis at 100 units
   * lets the mask geometry stay resolution independent.
   */
  getViewBox: (viewport: Viewport) => ViewBox;
  build: (context: MaskBuildContext) => MaskInstance;
}
