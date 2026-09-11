import gsap from "gsap";

import type {
  MaskAnimationSettings,
  MaskBuildContext,
  MaskDefinition,
  MaskInstance,
  Viewport,
} from "../types";
import { createRect } from "./MaskEngine";

/** Small overlap keeping neighbouring rects gap free while animating. */
const OVERLAP = 0.02;

interface Blind {
  top: SVGRectElement;
  bottom: SVGRectElement;
  /** Vertical center of the blind, in viewBox units. */
  y: number;
  /** Half height of the blind, in viewBox units. */
  h: number;
}

function build({ group, viewBox, cells }: MaskBuildContext): MaskInstance {
  const blindHeight = viewBox.height / cells;
  const blinds: Blind[] = [];

  for (let i = 0; i < cells; i += 1) {
    const centerY = viewBox.height - (i * blindHeight + blindHeight / 2);
    const top = createRect({ x: 0, y: centerY, width: viewBox.width, height: 0 });
    const bottom = createRect({
      x: 0,
      y: centerY,
      width: viewBox.width,
      height: 0,
    });

    group.append(top, bottom);
    blinds.push({ top, bottom, y: centerY, h: blindHeight / 2 });
  }

  const targets = blinds.flatMap((blind) => [blind.top, blind.bottom]);
  const blindOf = (index: number) => blinds[Math.floor(index / 2)];

  const closed = { attr: { y: (i: number) => blindOf(i).y, height: 0 } };
  const open = {
    attr: {
      y: (i: number) => (i % 2 === 0 ? blindOf(i).y - blindOf(i).h : blindOf(i).y),
      height: (i: number) => blindOf(i).h + OVERLAP,
    },
  };

  return {
    reset: () => gsap.set(targets, closed),
    complete: () => gsap.set(targets, open),
    reveal: ({ duration, stagger, ease }: MaskAnimationSettings) =>
      gsap.timeline().to(targets, {
        ...open,
        duration,
        ease,
        stagger: { each: stagger, from: "start" },
      }),
  };
}

export const horizontalBlinds: MaskDefinition = {
  id: "horizontal-blinds",
  label: "Horizontal Blinds",
  defaultCells: { desktop: 30, tablet: 20, mobile: 12 },
  getViewBox: ({ width, height }: Viewport) => ({
    width: 100,
    height: (height / width) * 100,
  }),
  build,
};
