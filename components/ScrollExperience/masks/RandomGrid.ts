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

function build({ group, viewBox, cells }: MaskBuildContext): MaskInstance {
  const columns = cells;
  const rows = Math.max(
    1,
    Math.round(columns * (viewBox.height / viewBox.width)),
  );
  const cellWidth = viewBox.width / columns;
  const cellHeight = viewBox.height / rows;
  const rects: SVGRectElement[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const rect = createRect({
        x: column * cellWidth,
        y: row * cellHeight,
        width: cellWidth + OVERLAP,
        height: cellHeight + OVERLAP,
        opacity: 0,
      });
      group.appendChild(rect);
      rects.push(rect);
    }
  }

  // Shuffled once per build so the pattern stays stable while scrubbing.
  const shuffled = gsap.utils.shuffle([...rects]);

  return {
    reset: () => gsap.set(rects, { attr: { opacity: 0 } }),
    complete: () => gsap.set(rects, { attr: { opacity: 1 } }),
    reveal: ({ duration, stagger, ease }: MaskAnimationSettings) =>
      gsap.timeline().to(shuffled, {
        attr: { opacity: 1 },
        duration,
        ease,
        stagger: { each: stagger },
      }),
  };
}

export const randomGrid: MaskDefinition = {
  id: "random-grid",
  label: "Random Grid",
  defaultCells: { desktop: 14, tablet: 10, mobile: 6 },
  getViewBox: ({ width, height }: Viewport) => ({
    width: 100,
    height: (height / width) * 100,
  }),
  build,
};
