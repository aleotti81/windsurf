import type {
  MaskDefinition,
  ResponsiveValue,
  TransitionId,
  Viewport,
} from "../types";
import { horizontalBlinds } from "./HorizontalBlinds";
import { randomGrid } from "./RandomGrid";
import { verticalBlinds } from "./VerticalBlinds";

export const SVG_NS = "http://www.w3.org/2000/svg";

/** Breakpoints shared by the mask presets and the layout CSS. */
export const BREAKPOINTS = {
  mobile: 599,
  tablet: 1024,
} as const;

const registry: Record<TransitionId, MaskDefinition> = {
  "horizontal-blinds": horizontalBlinds,
  "vertical-blinds": verticalBlinds,
  "random-grid": randomGrid,
};

export function getMask(transition: TransitionId): MaskDefinition {
  return registry[transition] ?? horizontalBlinds;
}

/** Every registered transition — useful for pickers in a future editor UI. */
export function listMasks(): MaskDefinition[] {
  return Object.values(registry);
}

export function resolveResponsiveValue(
  value: ResponsiveValue,
  viewport: Viewport,
): number {
  if (typeof value === "number") return value;
  if (viewport.width <= BREAKPOINTS.mobile) return value.mobile;
  if (viewport.width <= BREAKPOINTS.tablet) return value.tablet;
  return value.desktop;
}

export function createRect(attributes: Record<string, string | number>) {
  const rect = document.createElementNS(SVG_NS, "rect");
  rect.setAttribute("fill", "white");
  rect.setAttribute("shape-rendering", "crispEdges");
  for (const [key, value] of Object.entries(attributes)) {
    rect.setAttribute(key, String(value));
  }
  return rect;
}
