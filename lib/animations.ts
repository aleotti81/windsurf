import gsap from "gsap";

import type { ScrollAnimationConfig } from "@/components/ScrollExperience/types";

export const ANIMATION_DEFAULTS: Required<ScrollAnimationConfig> = {
  duration: 1,
  scrub: 2,
  stagger: 0.02,
  ease: "none",
  hold: 1,
  sectionScrollVh: 120,
};

export function resolveAnimation(
  animation?: ScrollAnimationConfig,
): Required<ScrollAnimationConfig> {
  return { ...ANIMATION_DEFAULTS, ...animation };
}

export const TEXT_HIDDEN = {
  clipPath: "inset(0% 0% 100% 0%)",
  y: 40,
  opacity: 0,
} as const;

export const TEXT_VISIBLE = {
  clipPath: "inset(0% 0% 0% 0%)",
  y: 0,
  opacity: 1,
} as const;

export function textIn(element: Element, duration: number) {
  return gsap.to(element, { ...TEXT_VISIBLE, duration, ease: "expo.out" });
}

export function textOut(element: Element, duration: number) {
  return gsap.to(element, {
    ...TEXT_HIDDEN,
    y: -40,
    duration,
    ease: "power2.inOut",
  });
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

export function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  wait: number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: T) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => callback(...args), wait);
  };
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
  };
  return debounced;
}
