# AT-9 — Admin Pricing Configuration Screen

## Goal

Build the `/admin/pricing` page — a single form to read and update the 4 pricing config fields. NOT a CRUD table.

## Requirements

### Page layout
- Title "Pricing Configuration"
- A card/form showing 4 number fields, pre-populated from the API on mount
- "Save" button that submits the updated config
- Success/error feedback message after save

### Data flow
1. On mount: call `getPricingConfig(token)` → populate form fields
2. User edits fields
3. On save: call `updatePricingConfig(input, token)` → show success message
4. Show loading state while fetching initial config

### Fields
- Delivery Fee (number, e.g. `500` for 500 DA)
- Service Fee Rate (number, e.g. `0.05` for 5%)
- Tax Rate (number, e.g. `0.19` for 19%)
- Discount Rate (number, e.g. `0.10` for 10%)

### Form
Use `react-hook-form`. No separate form component needed — build the form directly in the page since it's simple and not reused elsewhere.

## API functions

```typescript
import { getPricingConfig, updatePricingConfig } from '@acme/api-client/admin';
import type { PricingConfig, UpdatePricingConfigInput } from '@acme/api-client/admin';

// getPricingConfig(token) → Promise<PricingConfig>
// updatePricingConfig(input: UpdatePricingConfigInput, token) → Promise<PricingConfig>
```

## PricingConfig type

```typescript
type PricingConfig = {
  deliveryFee: number;
  serviceFeeRate: number;
  taxRate: number;
  discountRate: number;
};
// UpdatePricingConfigInput = Partial<PricingConfig>
```

## Key files to read
- `apps/web/src/routes/admin/admin-stores-page.tsx` — reference for styling and auth pattern
- `apps/web/src/routes/admin/admin-login-page.tsx` — reference for simple form page
- `packages/api-client/src/admin/pricing.ts` — API functions

## Files to edit
- `apps/web/src/routes/admin/admin-pricing-page.tsx` — replace stub

## Constraints
- Named exports only, inline styles, stone color palette
- Use `react-hook-form` for the form
- Show a green success banner on save, red error banner on failure
- No table, no modal, no delete — just a simple form
- Run `pnpm --filter web lint` before marking done

## Done when
- [ ] Page loads and displays current pricing config from API
- [ ] Editing fields and saving works
- [ ] Success/error feedback shown
- [ ] `pnpm --filter web lint` passes
- [ ] Task marked `[x]` in `.claude/tasks/active.md`
