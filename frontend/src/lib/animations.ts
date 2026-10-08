import { animate, stagger } from "animejs";

/**
 * Animate elements with staggered fade-in and slide-up effect.
 */
export function staggerEntrance(targets: Element[] | HTMLElement[] | NodeListOf<Element> | HTMLElement, options?: { delay?: number; duration?: number }) {
  return animate(targets as any, {
    opacity: [0, 1],
    translateY: [20, 0],
    delay: stagger(options?.delay ?? 80),
    duration: options?.duration ?? 600,
    easing: "easeOutExpo",
  });
}

/**
 * Fade in a single element smoothly.
 */
export function fadeIn(target: HTMLElement | Element | null, options?: { duration?: number; translateY?: number }) {
  if (!target) return;
  return animate(target as any, {
    opacity: [0, 1],
    translateY: [options?.translateY ?? 15, 0],
    duration: options?.duration ?? 700,
    easing: "easeOutQuad",
  });
}
