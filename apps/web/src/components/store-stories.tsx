import { Link } from 'react-router-dom';

type StoreStory = {
  id: string;
  name: string;
};

// Static placeholder data for now. TODO: replace with getStores() from the
// backend — map each store's id + imageUrl into these entries (and swap the
// initials avatar below for an <img src={createImageUrl(store.imageUrl)} />).
const STATIC_STORIES: StoreStory[] = [
  { id: 'fresh-market', name: 'Fresh Market' },
  { id: 'green-grocer', name: 'Green Grocer' },
  { id: 'daily-bakery', name: 'Daily Bakery' },
  { id: 'butcher-block', name: 'Butcher Block' },
  { id: 'corner-pharmacy', name: 'Corner Pharmacy' },
  { id: 'flower-studio', name: 'Flower Studio' },
  { id: 'tech-corner', name: 'Tech Corner' },
  { id: 'home-essentials', name: 'Home Essentials' }
];

const AVATAR_COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'];

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

export const StoreStories = () => (
  <section aria-label="Stores" className="w-full">
    <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {STATIC_STORIES.map((store) => (
        <Link
          key={store.id}
          className="flex w-[76px] shrink-0 flex-col items-center gap-1.5 focus:outline-none"
          to={`/stores/${store.id}/products`}
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
        </Link>
      ))}
    </div>
  </section>
);
