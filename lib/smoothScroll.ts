import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { isTouchDevice, prefersReducedMotion } from "./animations";

export interface SmoothScroll {
  scrollTo: (target: number) => void;
  destroy: () => void;
}

/**
 * Starts Lenis and keeps ScrollTrigger in sync with it.
 * Falls back to native scrolling when the user asked for reduced motion.
 */
export function initSmoothScroll(): SmoothScroll {
  if (prefersReducedMotion()) {
    return {
      scrollTo: (target) => window.scrollTo({ top: target }),
      destroy: () => {},
    };
  }

  const lenis = new Lenis({
    lerp: 0.15,
    smoothWheel: true,
    syncTouch: !isTouchDevice(),
  });

  const update = () => ScrollTrigger.update();
  const raf = (time: number) => lenis.raf(time * 1000);

  lenis.on("scroll", update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return {
    scrollTo: (target) => lenis.scrollTo(target),
    destroy: () => {
      lenis.off("scroll", update);
      gsap.ticker.remove(raf);
      lenis.destroy();
    },
  };
}
