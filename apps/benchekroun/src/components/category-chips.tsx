import type { Store } from '@acme/api-client/stores';

type CategoryChipsProps = {
  stores: Store[];
  selectedStoreId: string | null;
  onSelect: (storeId: string | null) => void;
  allLabel: string;
};

// Backend stores are surfaced as browsable "categories" within the single
// دار بنشقرون house. `null` = show everything.
export function CategoryChips({ stores, selectedStoreId, onSelect, allLabel }: CategoryChipsProps) {
  if (stores.length === 0) {
    return null;
  }

  const chip = (id: string | null, label: string) => {
    const isActive = selectedStoreId === id;
    return (
      <button
        key={id ?? '__all__'}
        aria-pressed={isActive}
        className={`min-h-10 shrink-0 rounded-full border px-5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-black ${
          isActive
            ? 'border-brand-gold bg-brand-gold text-brand-black'
            : 'border-brand-line text-brand-muted hover:border-brand-gold-dim hover:text-brand-ink'
        }`}
        onClick={() => onSelect(id)}
        type="button"
      >
        {label}
      </button>
    );
  };

  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
      {chip(null, allLabel)}
      {stores.map((store) => chip(store.id, store.name))}
    </div>
  );
}
