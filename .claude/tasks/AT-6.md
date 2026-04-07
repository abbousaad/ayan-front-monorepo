# AT-6 — Admin Stores Management Screen

## Goal

Replace the stub `AdminStoresPage` with a working CRUD page for stores. All UI components already exist — this task is wiring them together.

## Requirements

### Page layout
- Page title "Stores" + a green "New Store" button (top right)
- Below: an `AdminTable` showing all stores
- Table columns: image thumbnail (40x40 rounded), name, category, slug, actions (Edit + Delete buttons)

### Data fetching
- On mount, call `getStores()` from `@acme/api-client/stores` — it returns `{ data: Store[] }`
- Show loading state via `AdminTable`'s `isLoading` prop
- Create a `fetchStores()` function that can be called after any mutation to refresh the list

### Create flow
- "New Store" button sets `showForm = true` and `editingStore = null`
- Render `StoreForm` in a modal overlay (fixed position, centered, semi-transparent backdrop)
- `onSubmit`: call `createStore(input, token)` from `@acme/api-client/admin` where:
  - `input: { name, category, slug, image? }` (map `StoreFormValues` + `imageFile` to `CreateStoreInput`)
  - `token` comes from `useAdminAuth().token`
- On success: close form, refetch stores

### Edit flow
- Edit button sets `showForm = true` and `editingStore = store`
- Render `StoreForm` with `initialValues: { name, category, slug }` from the store being edited
- `onSubmit`: call `updateStore(store.id, { name, category, slug }, token)` — image is ignored on update (API limitation)
- On success: close form, refetch stores

### Delete flow
- Delete button sets `deletingStore = store`
- Render `ConfirmDialog` with title "Delete Store" and message "Are you sure you want to delete {store.name}?"
- `onConfirm`: call `deleteStore(store.id, token)`, then close dialog, refetch stores
- Track `isDeleting` state for the `isConfirming` prop

## Existing components to use (DO NOT rebuild these)

### `AdminTable<T>` — `apps/web/src/components/admin/shared/admin-table.tsx`
```tsx
<AdminTable<Store>
  columns={columns}
  data={stores}
  keyExtractor={(s) => s.id}
  isLoading={isLoading}
  emptyMessage="No stores found."
/>
```
Where `Column<T> = { header: string; render: (item: T) => ReactNode; width?: string }`

### `ConfirmDialog` — `apps/web/src/components/admin/shared/confirm-dialog.tsx`
```tsx
<ConfirmDialog
  open={deletingStore !== null}
  title="Delete Store"
  message={`Are you sure you want to delete "${deletingStore?.name}"?`}
  isConfirming={isDeleting}
  onConfirm={handleDelete}
  onCancel={() => setDeletingStore(null)}
/>
```

### `StoreForm` — `apps/web/src/components/admin/stores/store-form.tsx`
```tsx
<StoreForm
  initialValues={editingStore ? { name, category, slug } : undefined}
  onSubmit={async (values, imageFile) => { /* call createStore or updateStore */ }}
  onCancel={() => setShowForm(false)}
  submitLabel={editingStore ? 'Update' : 'Create'}
/>
```
Props: `{ initialValues?: StoreFormValues; onSubmit: (values, imageFile) => Promise<void>; onCancel: () => void; submitLabel?: string }`

## API functions to use

```tsx
import { getStores } from '@acme/api-client/stores';
import { createStore, updateStore, deleteStore } from '@acme/api-client/admin';
import type { Store } from '@acme/api-client/stores';
import type { CreateStoreInput } from '@acme/api-client/admin';
```

- `getStores()` → `Promise<{ data: Store[] }>` (no auth needed)
- `createStore(input: CreateStoreInput, token: string)` → `Promise<Store>`
- `updateStore(id: string, input: UpdateStoreInput, token: string)` → `Promise<Store>`
- `deleteStore(id: string, token: string)` → `Promise<void>`

Auth token: `const { token } = useAdminAuth()` from `apps/web/src/admin/use-admin-auth.ts`

## Key files to read before starting
- `apps/web/src/routes/admin/admin-stores-page.tsx` — the stub to replace
- `apps/web/src/components/admin/shared/admin-table.tsx` — table component
- `apps/web/src/components/admin/shared/confirm-dialog.tsx` — delete confirmation
- `apps/web/src/components/admin/stores/store-form.tsx` — create/edit form
- `apps/web/src/routes/admin/admin-login-page.tsx` — reference for styling patterns and inline styles
- `packages/api-client/src/admin/stores.ts` — API functions
- `packages/api-client/src/stores/types.ts` — Store type definition

## Constraints
- Only edit `apps/web/src/routes/admin/admin-stores-page.tsx` — everything else already exists
- Named exports only (the stub already uses `export function AdminStoresPage`)
- Inline styles (no CSS files) — match the stone color palette used in other admin pages
- Use `react-icons/fi` for edit/delete icons: `FiEdit2`, `FiTrash2`, `FiPlus`
- Do not install any new packages
- Run `pnpm --filter web lint` and fix all errors before marking done

## Done when
- [ ] Page fetches and displays stores in a table
- [ ] Create new store works (form → API → table refreshes)
- [ ] Edit store works (pre-filled form → API → table refreshes)
- [ ] Delete store works (confirm dialog → API → table refreshes)
- [ ] `pnpm --filter web lint` passes with no errors
- [ ] Task marked `[x]` in `.claude/tasks/active.md`
