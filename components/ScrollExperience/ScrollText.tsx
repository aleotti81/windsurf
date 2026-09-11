"use client";

import type { Ref } from "react";

import type { ScrollSection } from "./types";

interface ScrollTextProps {
  section: ScrollSection;
  /** First section owns the page `<h1>`. */
  isFirst: boolean;
  /**
   * The engine animates this element on the master GSAP timeline, so the
   * component only owns markup and typography.
   */
  ref?: Ref<HTMLDivElement>;
}

export function ScrollText({ section, isFirst, ref }: ScrollTextProps) {
  const Heading = isFirst ? "h1" : "h2";

  return (
    <div className="scroll-text" ref={ref}>
      {section.eyebrow ? (
        <p className="scroll-text__eyebrow">{section.eyebrow}</p>
      ) : null}
      <Heading className="scroll-text__title" id={`${section.id}-title`}>
        {section.title}
      </Heading>
      {section.subtitle ? (
        <p className="scroll-text__subtitle">{section.subtitle}</p>
      ) : null}
      {section.description ? (
        <p className="scroll-text__description">{section.description}</p>
      ) : null}
      {section.cta ? (
        <a className="scroll-text__cta" href={section.cta.href}>
          {section.cta.label}
        </a>
      ) : null}
    </div>
  );
}
