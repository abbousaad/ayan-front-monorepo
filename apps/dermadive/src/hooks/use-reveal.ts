import { useEffect } from 'react';

/**
 * Reveal-on-scroll, ported from the design's vanilla script: toggles `.is-in` on
 * every `.rise` / `.step` element as it enters the viewport. Honours
 * prefers-reduced-motion (everything shown immediately). Runs once after mount,
 * so the landing markup is already in the DOM.
 */
export function useReveal(): void {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.rise, .step'));

    if (!('IntersectionObserver' in window) || reduce) {
      elements.forEach((element) => element.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}
