"use client";

import type { Ref } from "react";

import { ScrollText } from "./ScrollText";
import type { ScrollSection } from "./types";

interface ScrollLayerProps {
  section: ScrollSection;
  index: number;
  /** Unique per experience instance, so several experiences can coexist. */
  maskId: string;
  svgRef: Ref<SVGSVGElement>;
  groupRef: Ref<SVGGElement>;
  textRef: Ref<HTMLDivElement>;
}

/**
 * One fullscreen image layer.
 *
 * The `<image>` is masked by a `<g>` the engine fills with mask cells at
 * runtime. `next/image` cannot be used here: SVG masking requires a real
 * `<image>` node inside the SVG document.
 */
export function ScrollLayer({
  section,
  index,
  maskId,
  svgRef,
  groupRef,
  textRef,
}: ScrollLayerProps) {
  const titleId = `${section.id}-title`;

  return (
    <section
      className="layer"
      id={section.id}
      aria-labelledby={titleId}
      style={{ zIndex: index + 1 }}
    >
      <svg
        className="layer__canvas"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="img"
        aria-label={section.imageAlt ?? section.title}
        ref={svgRef}
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <g ref={groupRef} />
          </mask>
        </defs>
        <image
          href={section.image}
          x="0"
          y="0"
          width="100"
          height="100"
          preserveAspectRatio="xMidYMid slice"
          mask={`url(#${maskId})`}
        />
      </svg>
      <div className="layer__content">
        <ScrollText section={section} isFirst={index === 0} ref={textRef} />
      </div>
    </section>
  );
}
