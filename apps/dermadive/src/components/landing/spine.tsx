import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

// The stepped colour column lifted off the tubes, turned into the page's scroll
// spine. Scroll-spy follows the three product sections (ported from the design's
// vanilla IntersectionObserver). Rendered site-wide as brand furniture; off the
// home page no product section matches, so it simply rests inactive.
const STEPS = [
  { id: 'nettodive', label: '01 · Nettoyer', color: 'var(--onde)', bar: '#0E86C4' },
  { id: 'sundive', label: '02 · Protéger', color: 'var(--soleil)', bar: '#E67E28' },
  { id: 'ecladive', label: '03 · Corriger', color: 'var(--argent)', bar: '#6E7A86' }
] as const;

export function Spine() {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    const sections = STEPS.map((step) => document.getElementById(step.id)).filter(
      (element): element is HTMLElement => element !== null
    );

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(STEPS.findIndex((step) => step.id === entry.target.id));
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const barWidth = active < 0 ? '0%' : `${((active + 1) / 3) * 100}%`;
  const barColor = active < 0 ? 'var(--brume)' : STEPS[active].bar;

  return (
    <>
      <aside className="spine" aria-hidden="true">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`spine__step${index === active ? ' is-on' : ''}`}
            data-spine={step.id}
            style={{ '--c': step.color } as CSSProperties}
          >
            {step.label}
          </div>
        ))}
      </aside>

      <div className="spine-m" aria-hidden="true">
        <span style={{ width: barWidth, background: barColor }} />
      </div>
    </>
  );
}
