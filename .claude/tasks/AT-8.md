# AT-8 — Admin Coupons Management Screen

## Goal

Build the `/admin/coupons` CRUD page with inline active toggle. Follow the stores page pattern.

## Requirements

### Page layout
- Title "Coupons" + green "New Coupon" button (top right)
- `AdminTable` showing all coupons

### Table columns
- Code
- Type (show "Fixed" or "Percentage")
- Value (show as `$X` for fixed, `X%` for percentage)
- Active (toggle switch — clicking calls `updateCoupon(id, { isActive: !current }, token)`)
- Starts / Ends (formatted dates)
- Uses (show `usedCount / maxUses` or `usedCount / ∞` if maxUses is null)
- Actions (Edit + Delete)

### Create flow
- "New Coupon" → modal with `CouponForm` (new component)
- On submit: `createCoupon(input, token)` → close → refetch
- `CouponInput = { code, discountType, discountValue, startsAt, endsAt, isActive?, maxUses? }`

### Edit flow
- Edit button → modal with `CouponForm` pre-filled
- On submit: `updateCoupon(id, input, token)` → close → refetch

### Delete flow
- Delete button → `ConfirmDialog` → `deleteCoupon(id, token)` → refetch

### Inline active toggle
- In the Active column, render a styled toggle/checkbox
- On click: call `updateCoupon(id, { isActive: !coupon.isActive }, token)` then refetch
- No modal needed for this action

### CouponForm component (NEW — create this)
Create `apps/web/src/components/admin/coupons/coupon-form.tsx`:

```typescript
type CouponFormValues = {
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  startsAt: string;  // date input value (YYYY-MM-DD)
  endsAt: string;
  isActive: boolean;
  maxUses: string;   // string from input, convert to number | null on submit
};

type CouponFormProps = {
  initialValues?: CouponFormValues;
  onSubmit: (values: CouponFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};
```

Fields: code (text), discountType (radio or select: fixed/percentage), discountValue (number), startsAt (date input), endsAt (date input), isActive (checkbox), maxUses (number input, empty = unlimited).

## API functions

```typescript
import { listCoupons, createCoupon, updateCoupon, deleteCoupon } from '@acme/api-client/admin';
import type { CouponInput, UpdateCouponInput, Coupon } from '@acme/api-client/admin';

// listCoupons(token) → Promise<Coupon[]>
// createCoupon(input: CouponInput, token) → Promise<Coupon>
// updateCoupon(id, input: UpdateCouponInput, token) → Promise<Coupon>
// deleteCoupon(id, token) → Promise<void>
```

## Coupon type

```typescript
type Coupon = {
  id: string;
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  maxUses: number | null;
  usedCount: number;
};
```

## Key files to read
- `apps/web/src/routes/admin/admin-stores-page.tsx` — **the pattern to follow**
- `apps/web/src/components/admin/stores/store-form.tsx` — form pattern
- `packages/api-client/src/admin/coupons.ts` — API functions
- `packages/api-client/src/admin/types.ts` — Coupon types

## Files to edit/create
- `apps/web/src/routes/admin/admin-coupons-page.tsx` — replace stub
- `apps/web/src/components/admin/coupons/coupon-form.tsx` — NEW

## Constraints
- Named exports only, inline styles, stone color palette
- Use `react-hook-form` for CouponForm, `react-icons/fi` for icons
- Convert date strings for the API (ISO format)
- Handle `maxUses` being null (unlimited) in both form and table display
- Run `pnpm --filter web lint` before marking done

## Done when
- [ ] Coupons table renders with data from API
- [ ] Inline active toggle works
- [ ] CouponForm component created
- [ ] Create/edit/delete all work
- [ ] `pnpm --filter web lint` passes
- [ ] Task marked `[x]` in `.claude/tasks/active.md`
