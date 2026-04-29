# MT-3: Cart header button with badge

## Goal
Add a cart icon button in the header of HomeScreen and StoreProductsScreen that shows the total item count and navigates to the cart screen.

## Files to create
- `apps/mobile/src/components/cart-button.tsx` — icon button with green badge overlay showing `cartCount`

## Files to modify
- `apps/mobile/src/home-screen.tsx` — add `CartButton` to `HomeHeader`, accept `onOpenCart` prop
- `apps/mobile/src/store-products-screen.tsx` — add `CartButton` to header row, accept `onOpenCart` prop
- `apps/mobile/App.tsx` — pass `onOpenCart={() => setActiveScreen({ name: 'cart' })}` to both screens

## Context
- `useCart().cartCount` from MT-1 gives item count
- `Ionicons` is already imported in home-screen (`cart-outline` icon works well)
- Brand green: `brandColors.logoGreen` (`#1f6446`)
- Badge should be hidden when `cartCount === 0`

## Details
- `accessibilityLabel="Open cart"` on the Pressable.
- Badge text caps at `"99+"` when `cartCount > 99`.

## Acceptance criteria
- Badge shows correct count after adding items
- Badge hidden when cart is empty
- Badge displays `"99+"` for counts > 99
- Tapping button triggers `onOpenCart` callback (navigation wired in App.tsx)
- Done: tick `[x] MT-3` in `.claude/tasks/activemobile.md` and commit
