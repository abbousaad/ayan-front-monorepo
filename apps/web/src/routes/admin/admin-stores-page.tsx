import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { ApiClientError } from '@acme/api-client';
import { getStores } from '@acme/api-client/stores';
import { createStore, updateStore, deleteStore } from '@acme/api-client/admin';
import { createImageUrl } from '@acme/api-client';
import type { Store } from '@acme/api-client/stores';
import type { CreateStoreInput } from '@acme/api-client/admin';
import { useAdminAuth } from '../../admin/use-admin-auth';
import { AdminTable, type Column } from '../../components/admin/shared/admin-table';
import { ConfirmDialog } from '../../components/admin/shared/confirm-dialog';
import { StoreForm } from '../../components/admin/stores/store-form';

export function AdminStoresPage(): React.JSX.Element {
  const { token, handleUnauthorized } = useAdminAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [deletingStore, setDeletingStore] = useState<Store | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStores = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await getStores();
      setStores(response.data);
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchStores();
  }, []);

  const handleCreate = async (values: { name: string; category: string; slug: string }, imageFile: File | undefined): Promise<void> => {
    const input: CreateStoreInput = {
      name: values.name,
      category: values.category as CreateStoreInput['category'],
      slug: values.slug,
      image: imageFile
    };
    try {
      await createStore(input, token!);
      setShowForm(false);
      await fetchStores();
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      throw error;
    }
  };

  const handleUpdate = async (values: { name: string; category: string; slug: string }): Promise<void> => {
    if (editingStore === null) return;
    try {
      await updateStore(editingStore.id, {
        name: values.name,
        category: values.category as CreateStoreInput['category'],
        slug: values.slug
      }, token!);
      setShowForm(false);
      setEditingStore(null);
      await fetchStores();
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      throw error;
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (deletingStore === null) return;
    setIsDeleting(true);
    try {
      await deleteStore(deletingStore.id, token!);
      setDeletingStore(null);
      await fetchStores();
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateForm = (): void => {
    setEditingStore(null);
    setShowForm(true);
  };

  const openEditForm = (store: Store): void => {
    setEditingStore(store);
    setShowForm(true);
  };

  const closeForm = (): void => {
    setShowForm(false);
    setEditingStore(null);
  };

  const columns: Column<Store>[] = [
    {
      header: 'Image',
      width: '80px',
      render: (store) => (
        <img
          src={createImageUrl(store.imageUrl)}
          alt={store.name}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '6px',
            objectFit: 'cover' as const
          }}
        />
      )
    },
    {
      header: 'Name',
      render: (store) => store.name
    },
    {
      header: 'Category',
      render: (store) => store.category.charAt(0).toUpperCase() + store.category.slice(1)
    },
    {
      header: 'Slug',
      render: (store) => store.slug
    },
    {
      header: 'Actions',
      width: '120px',
      render: (store) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => { openEditForm(store); }}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #d6d3d1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FiEdit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => { setDeletingStore(store); }}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #d6d3d1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1c1917', margin: 0 }}>
          Stores
        </h1>
        <button
          type="button"
          onClick={openCreateForm}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#1f6446',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <FiPlus size={16} />
          New Store
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <AdminTable<Store>
          columns={columns}
          data={stores}
          keyExtractor={(s) => s.id}
          isLoading={isLoading}
          emptyMessage="No stores found."
        />
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              padding: '24px',
              width: '100%',
              maxWidth: '480px'
            }}
            onClick={(e) => { e.stopPropagation(); }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1c1917', margin: '0 0 20px' }}>
              {editingStore !== null ? 'Edit Store' : 'New Store'}
            </h2>
            <StoreForm
              initialValues={editingStore !== null ? {
                name: editingStore.name,
                category: editingStore.category,
                slug: editingStore.slug
              } : undefined}
              onSubmit={editingStore !== null ? handleUpdate : handleCreate}
              onCancel={closeForm}
              submitLabel={editingStore !== null ? 'Update' : 'Create'}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deletingStore !== null}
        title="Delete Store"
        message={`Are you sure you want to delete "${deletingStore?.name}"?`}
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeletingStore(null); }}
      />
    </div>
  );
}
