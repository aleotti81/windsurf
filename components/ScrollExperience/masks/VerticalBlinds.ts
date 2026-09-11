import gsap from "gsap";

import type {
  MaskAnimationSettings,
  MaskBuildContext,
  MaskDefinition,
  MaskInstance,
  Viewport,
} from "../types";
import { createRect } from "./MaskEngine";

const OVERLAP = 0.05;

interface Blind {
  left: SVGRectElement;
  right: SVGRectElement;
  /** Horizontal center of the blind, in viewBox units. */
  x: number;
  /** Half width of the blind, in viewBox units. */
  w: number;
}

function build({ group, viewBox, cells }: MaskBuildContext): MaskInstance {
  const blindWidth = viewBox.width / cells;
  const blinds: Blind[] = [];

  for (let i = 0; i < cells; i += 1) {
    const centerX = i * blindWidth + blindWidth / 2;
    const left = createRect({
      x: centerX,
      y: 0,
      width: 0,
      height: viewBox.height,
    });
    const right = createRect({
      x: centerX,
      y: 0,
      width: 0,
      height: viewBox.height,
    });

    group.append(left, right);
    blinds.push({ left, right, x: centerX, w: blindWidth / 2 });
  }

  const targets = blinds.flatMap((blind) => [blind.left, blind.right]);
  const blindOf = (index: number) => blinds[Math.floor(index / 2)];

  const closed = { attr: { x: (i: number) => blindOf(i).x, width: 0 } };
  const open = {
    attr: {
      x: (i: number) => (i % 2 === 0 ? blindOf(i).x - blindOf(i).w : blindOf(i).x),
      width: (i: number) => blindOf(i).w + OVERLAP,
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

export const verticalBlinds: MaskDefinition = {
  id: "vertical-blinds",
  label: "Vertical Blinds",
  defaultCells: { desktop: 12, tablet: 9, mobile: 6 },
  getViewBox: ({ width, height }: Viewport) => ({
    width: (width / height) * 100,
    height: 100,
  }),
  build,
};
