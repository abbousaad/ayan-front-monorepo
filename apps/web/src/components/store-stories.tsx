import { useCallback, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { useI18n } from '../contexts/i18n-context';

type StorySlide = {
  id: string;
  background: string;
  caption: string;
};

type StoreStory = {
  id: string;
  name: string;
  slides: StorySlide[];
};

const AVATAR_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'];

const SLIDE_GRADIENTS = [
  'linear-gradient(160deg, #f59e0b 0%, #ec4899 100%)',
  'linear-gradient(160deg, #10b981 0%, #3b82f6 100%)',
  'linear-gradient(160deg, #8b5cf6 0%, #ec4899 100%)',
  'linear-gradient(160deg, #ef4444 0%, #f59e0b 100%)'
];

const SLIDE_CAPTIONS = ['New this week', "Today's deals", 'Best sellers'];

// Static placeholder data for now. TODO: replace with getStores() + real story
// media from the backend — map each store's id/name and its story images here.
const buildStore = (id: string, name: string): StoreStory => ({
  id,
  name,
  slides: SLIDE_CAPTIONS.map((caption, index) => ({
    id: `${id}-${index}`,
    background: SLIDE_GRADIENTS[index % SLIDE_GRADIENTS.length],
    caption
  }))
});

const STORIES: StoreStory[] = [
  buildStore('fresh-market', 'Fresh Market'),
  buildStore('green-grocer', 'Green Grocer'),
  buildStore('daily-bakery', 'Daily Bakery'),
  buildStore('butcher-block', 'Butcher Block'),
  buildStore('corner-pharmacy', 'Corner Pharmacy'),
  buildStore('flower-studio', 'Flower Studio'),
  buildStore('tech-corner', 'Tech Corner'),
  buildStore('home-essentials', 'Home Essentials')
];

const SLIDE_DURATION_MS = 4000;

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((word) => word[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

const getAvatarColor = (id: string): string => {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = id.charCodeAt(index) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const StoreStories = () => {
  const [activeStoreIndex, setActiveStoreIndex] = useState<number | null>(null);

  return (
    <>
      <section aria-label="Stores" className="w-full">
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STORIES.map((store, index) => (
            <button
              key={store.id}
              aria-label={`${store.name} stories`}
              className="flex w-[76px] shrink-0 flex-col items-center gap-1.5 focus:outline-none"
              onClick={() => setActiveStoreIndex(index)}
              type="button"
            >
              <span className="rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[3px] transition-transform duration-200 hover:scale-105">
                <span className="block rounded-full bg-white p-[2px]">
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-white"
                    style={{ backgroundColor: getAvatarColor(store.id) }}
                  >
                    {getInitials(store.name)}
                  </span>
                </span>
              </span>
              <span className="w-full truncate text-center text-xs" style={{ color: 'var(--color-body-text)' }}>
                {store.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {activeStoreIndex !== null ? (
        <StoryViewer
          initialStoreIndex={activeStoreIndex}
          onClose={() => setActiveStoreIndex(null)}
          stores={STORIES}
        />
      ) : null}
    </>
  );
};

type StoryViewerProps = {
  stores: StoreStory[];
  initialStoreIndex: number;
  onClose: () => void;
};

function StoryViewer({ stores, initialStoreIndex, onClose }: StoryViewerProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [storeIndex, setStoreIndex] = useState(initialStoreIndex);
  const [slideIndex, setSlideIndex] = useState(0);

  const store = stores[storeIndex];
  const slide = store.slides[slideIndex];

  const goNext = useCallback(() => {
    if (slideIndex < store.slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else if (storeIndex < stores.length - 1) {
      setStoreIndex(storeIndex + 1);
      setSlideIndex(0);
    } else {
      onClose();
    }
  }, [onClose, slideIndex, store.slides.length, storeIndex, stores.length]);

  const goPrev = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    } else if (storeIndex > 0) {
      setStoreIndex(storeIndex - 1);
      setSlideIndex(0);
    }
  }, [slideIndex, storeIndex]);

  // Auto-advance each slide, and lock body scroll while open.
  useEffect(() => {
    const timer = window.setTimeout(goNext, SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [goNext, storeIndex, slideIndex]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') goNext();
      else if (event.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [goNext, goPrev, onClose]);

  const openProducts = () => {
    onClose();
    navigate(`/stores/${store.id}/products`);
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-3"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="relative flex h-[85vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl"
        onClick={(event) => event.stopPropagation()}
        style={{ background: slide.background }}
      >
        {/* Progress segments */}
        <div className="absolute inset-x-0 top-0 z-20 flex gap-1 p-3">
          {store.slides.map((segment, index) => (
            <div key={segment.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/40">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width: index < slideIndex ? '100%' : index > slideIndex ? '0%' : undefined,
                  animation:
                    index === slideIndex
                      ? `storyProgress ${SLIDE_DURATION_MS}ms linear forwards`
                      : undefined
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute inset-x-0 top-0 z-20 mt-4 flex items-center gap-3 px-3 pt-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-white/70"
            style={{ backgroundColor: getAvatarColor(store.id) }}
          >
            {getInitials(store.name)}
          </span>
          <span className="text-sm font-semibold text-white drop-shadow">{store.name}</span>
          <button
            aria-label="Close stories"
            className="ms-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/40"
            onClick={onClose}
            type="button"
          >
            <FiX aria-hidden="true" size={20} />
          </button>
        </div>

        {/* Tap zones */}
        <button
          aria-label="Previous"
          className="absolute inset-y-0 start-0 z-10 w-1/3 cursor-default focus:outline-none"
          onClick={goPrev}
          type="button"
        />
        <button
          aria-label="Next"
          className="absolute inset-y-0 end-0 z-10 w-2/3 cursor-default focus:outline-none"
          onClick={goNext}
          type="button"
        />

        {/* Slide content */}
        <div className="pointer-events-none relative z-0 flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">{store.name}</p>
          <p className="text-3xl font-bold text-white drop-shadow">{slide.caption}</p>
        </div>

        {/* Footer CTA */}
        <div className="relative z-20 p-4">
          <button
            className="inline-flex w-full min-h-11 items-center justify-center rounded-full bg-white/95 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white"
            onClick={openProducts}
            type="button"
          >
            {t('stories.viewProducts')}
          </button>
        </div>
      </div>
    </div>
  );
}
