"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  TEXT_HIDDEN,
  TEXT_VISIBLE,
  debounce,
  prefersReducedMotion,
  resolveAnimation,
  textIn,
  textOut,
} from "@/lib/animations";
import { initSmoothScroll, type SmoothScroll } from "@/lib/smoothScroll";

import { ProgressBar } from "./ProgressBar";
import { ScrollLayer } from "./ScrollLayer";
import { getMask, resolveResponsiveValue } from "./masks/MaskEngine";
import type {
  MaskInstance,
  ScrollExperienceConfig,
  Viewport,
} from "./types";

gsap.registerPlugin(ScrollTrigger);

type MotionMode = "full" | "reduced";

export function ScrollExperience({
  sections,
  transition,
  animation,
  cells,
}: ScrollExperienceConfig) {
  const uid = useId().replace(/:/g, "");
  const stageRef = useRef<HTMLDivElement | null>(null);
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const smoothRef = useRef<SmoothScroll | null>(null);
  const [motion, setMotion] = useState<MotionMode>("full");

  const settings = useMemo(() => resolveAnimation(animation), [animation]);

  const registerFill = useCallback(
    (index: number) => (element: HTMLSpanElement | null) => {
      fillRefs.current[index] = element;
    },
    [],
  );

  const seek = useCallback(
    (index: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const distance = stage.offsetHeight - window.innerHeight;
      const ratio = sections.length > 1 ? index / (sections.length - 1) : 0;
      smoothRef.current?.scrollTo(stage.offsetTop + distance * ratio);
    },
    [sections.length],
  );

  useEffect(() => {
    smoothRef.current = initSmoothScroll();
    return () => {
      smoothRef.current?.destroy();
      smoothRef.current = null;
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduced = prefersReducedMotion();
    setMotion(reduced ? "reduced" : "full");

    const mask = getMask(transition);
    let master: gsap.core.Timeline | null = null;
    let progress: ScrollTrigger | null = null;

    /** (Re)creates the mask cells for the current viewport. */
    const buildMasks = (): MaskInstance[] => {
      const viewport: Viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const viewBox = mask.getViewBox(viewport);
      const cellCount = Math.max(
        1,
        Math.round(
          resolveResponsiveValue(cells ?? mask.defaultCells, viewport),
        ),
      );
      const instances: MaskInstance[] = [];

      svgRefs.current.forEach((svg, index) => {
        const group = groupRefs.current[index];
        if (!svg || !group) return;

        svg.setAttribute("viewBox", `0 0 ${viewBox.width} ${viewBox.height}`);
        svg.querySelectorAll("mask > rect, image").forEach((node) => {
          node.setAttribute("width", String(viewBox.width));
          node.setAttribute("height", String(viewBox.height));
        });

        group.replaceChildren();
        const instance = mask.build({ group, viewBox, viewport, cells: cellCount });
        // The first layer is the entry point of the experience: always visible.
        if (index === 0 || reduced) instance.complete();
        else instance.reset();
        instances.push(instance);
      });

      return instances;
    };

    const buildTimeline = (instances: MaskInstance[]) => {
      const texts = textRefs.current.filter(
        (element): element is HTMLDivElement => Boolean(element),
      );

      if (reduced) {
        gsap.set(texts, TEXT_VISIBLE);
        return;
      }

      gsap.set(texts, TEXT_HIDDEN);
      if (texts[0]) gsap.set(texts[0], TEXT_VISIBLE);

      master = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: settings.scrub,
          invalidateOnRefresh: true,
        },
      });

      instances.forEach((instance, index) => {
        if (index === 0) return;

        const previous = texts[index - 1];
        if (previous) master?.add(textOut(previous, settings.duration * 0.8), ">");

        master?.add(instance.reveal(settings), "-=0.3");

        const current = texts[index];
        if (current) master?.add(textIn(current, settings.duration * 0.8), "-=0.5");

        master?.to({}, { duration: settings.hold });
      });
    };

    const buildProgress = () => {
      progress = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          const fills = fillRefs.current;
          const steps = fills.length;
          fills.forEach((fill, index) => {
            if (!fill) return;
            const value = gsap.utils.clamp(
              0,
              1,
              (self.progress - index / steps) * steps,
            );
            // Direct DOM write: no React state during scroll.
            fill.style.transform = `scaleX(${value})`;
          });
        },
      });
    };

    const build = () => {
      buildTimeline(buildMasks());
      if (!reduced) buildProgress();
    };

    const teardown = () => {
      master?.scrollTrigger?.kill();
      master?.kill();
      master = null;
      progress?.kill();
      progress = null;
    };

    build();

    const onResize = debounce(() => {
      teardown();
      build();
      ScrollTrigger.refresh();
    }, 250);

    window.addEventListener("resize", onResize);

    return () => {
      onResize.cancel();
      window.removeEventListener("resize", onResize);
      teardown();
    };
  }, [cells, sections, transition, settings]);

  return (
    <div className="experience" data-motion={motion}>
      <div
        className="stage"
        ref={stageRef}
        style={
          {
            "--sections": sections.length,
            "--section-scroll": settings.sectionScrollVh,
          } as CSSProperties
        }
      >
        <div className="layers">
          {sections.map((section, index) => (
            <ScrollLayer
              key={section.id}
              section={section}
              index={index}
              maskId={`mask-${uid}-${index}`}
              svgRef={(element) => {
                svgRefs.current[index] = element;
              }}
              groupRef={(element) => {
                groupRefs.current[index] = element;
              }}
              textRef={(element) => {
                textRefs.current[index] = element;
              }}
            />
          ))}
          <ProgressBar
            sections={sections}
            onSeek={seek}
            registerFill={registerFill}
          />
        </div>
      </div>
    </div>
  );
}
