# AT-7 — Admin Products Management Screen

## Goal

Build the `/admin/products` CRUD page with a store filter dropdown. Follow the exact pattern from the stores page.

## Requirements

### Page layout
- Title "Products" + green "New Product" button (top right)
- Store filter dropdown below header — populated from `getStores()`, with an "All Stores" option
- `AdminTable` showing products, filtered by selected store

### Table columns
- Image (40x40 thumbnail using `createImageUrl(product.imageUrl)`)
- Name
- Price (formatted as currency)
- Stock
- Unit
- Actions (Edit + Delete buttons)

### Create flow
- "New Product" → modal with `ProductForm` (new component, see below)
- On submit: call `createProduct(input, token)` → close form → refetch
- `CreateProductInput = { storeId, name, price, stock, description?, unit?, image? }`

### Edit flow
- Edit button → modal with `ProductForm` pre-filled
- On submit: call `updateProduct(id, input, token)` → close → refetch
- `UpdateProductInput = { storeId?, name?, price?, stock?, description?, unit? }` (no image on update)

### Delete flow
- Delete button → `ConfirmDialog` → `deleteProduct(id, token)` → refetch

### ProductForm component (NEW — create this)
Create `apps/web/src/components/admin/products/product-form.tsx` following the `StoreForm` pattern:

```typescript
type ProductFormValues = {
  storeId: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  unit: ProductUnit; // 'g' | 'kg' | 'ml' | 'l' | 'unit'
};

type ProductFormProps = {
  initialValues?: ProductFormValues;
  stores: Store[]; // for the storeId dropdown
  onSubmit: (values: ProductFormValues, imageFile: File | undefined) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};
```

Fields: storeId (select from stores list), name (text), price (number), stock (number), unit (select from `PRODUCT_UNITS`), description (textarea), image (file input).

## API functions

```typescript
// List (public)
import { getProducts } from '@acme/api-client/products';
import type { Product, ProductUnit, PRODUCT_UNITS } from '@acme/api-client/products';
// getProducts(query?) → Promise<{ data: Product[] }>
// query can include { storeId?: string }

// For store dropdown
import { getStores } from '@acme/api-client/stores';
import type { Store } from '@acme/api-client/stores';

// Admin CRUD
import { createProduct, updateProduct, deleteProduct } from '@acme/api-client/admin';
import type { CreateProductInput, UpdateProductInput } from '@acme/api-client/admin';

// Image URL helper
import { createImageUrl } from '@acme/api-client';

// Auth
import { useAdminAuth } from '../../admin/use-admin-auth';
```

## Product type

```typescript
type Product = {
  id: string;
  storeId: string;
  name: string;
  price: number;
  stock: number;
  description: string | null;
  imageUrl: string;
  unit: ProductUnit;
};
type ProductUnit = 'g' | 'kg' | 'ml' | 'l' | 'unit';
```

## Key files to read
- `apps/web/src/routes/admin/admin-stores-page.tsx` — **the pattern to follow exactly**
- `apps/web/src/components/admin/stores/store-form.tsx` — form pattern to follow for ProductForm
- `packages/api-client/src/admin/products.ts` — admin API functions
- `packages/api-client/src/products/types.ts` — Product type and PRODUCT_UNITS
- `packages/api-client/src/products/get-products.ts` — public list function

## Files to edit/create
- `apps/web/src/routes/admin/admin-products-page.tsx` — replace stub
- `apps/web/src/components/admin/products/product-form.tsx` — NEW

## Constraints
- Named exports only
- Inline styles (stone color palette)
- Use `react-hook-form` for ProductForm, `react-icons/fi` for icons
- Run `pnpm --filter web lint` before marking done

## Done when
- [ ] Products table renders with data from API
- [ ] Store filter dropdown filters the product list
- [ ] ProductForm component created
- [ ] Create/edit/delete all work
- [ ] `pnpm --filter web lint` passes
- [ ] Task marked `[x]` in `.claude/tasks/active.md`
