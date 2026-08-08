import { useBrandCopy } from '../i18n/use-brand-copy';

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-start">
      <div className="font-display text-3xl font-bold text-brand-gold">{value}</div>
      <div className="mt-1 text-xs text-brand-muted">{label}</div>
    </div>
  );
}

export function AboutSection() {
  const copy = useBrandCopy();

  return (
    <section className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8" id="about">
      <div className="mx-auto grid max-w-6xl overflow-hidden border border-brand-gold-dim/40 md:grid-cols-2">
        {/* Text */}
        <div className="p-8 text-start sm:p-12 lg:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">{copy.aboutEyebrow}</p>
          <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-brand-ink sm:text-5xl">
            {copy.aboutTitle}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-8 text-brand-muted">{copy.aboutBody}</p>
          <p className="mt-6 font-display text-lg italic text-brand-ink/80">{copy.aboutQuote}</p>

          <div className="mt-8 flex flex-wrap gap-10">
            <Stat label={copy.statFoundedLabel} value={copy.statFoundedValue} />
            <Stat label={copy.statNaturalLabel} value={copy.statNaturalValue} />
            <Stat label={copy.statHandmadeLabel} value={copy.statHandmadeValue} />
          </div>
        </div>

        {/* Image panel */}
        <div className="hero-hatch relative flex min-h-[16rem] items-center justify-center border-t border-brand-gold-dim/40 md:border-s md:border-t-0">
          <span className="text-[11px] uppercase tracking-[0.3em] text-brand-muted">{copy.aboutImageCaption}</span>
        </div>
      </div>
    </section>
  );
}
