import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { ApiClientError } from '@acme/api-client';
import { getProducts } from '@acme/api-client/products';
import { createProduct, updateProduct, deleteProduct } from '@acme/api-client/admin';
import { getStores } from '@acme/api-client/stores';
import { createImageUrl } from '@acme/api-client';
import type { Product, ProductUnit } from '@acme/api-client/products';
import type { CreateProductInput, UpdateProductInput } from '@acme/api-client/admin';
import type { Store } from '@acme/api-client/stores';
import { useAdminAuth } from '../../admin/use-admin-auth';
import { AdminTable, type Column } from '../../components/admin/shared/admin-table';
import { ConfirmDialog } from '../../components/admin/shared/confirm-dialog';
import { ProductForm } from '../../components/admin/products/product-form';

export function AdminProductsPage(): React.JSX.Element {
  const { token, handleUnauthorized } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStores = async (): Promise<void> => {
    try {
      const response = await getStores();
      setStores(response.data);
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
    }
  };

  const fetchProducts = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const query = selectedStoreId !== '' ? { storeId: selectedStoreId } : undefined;
      const response = await getProducts(query);
      setProducts(response.data);
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

  useEffect(() => {
    void fetchProducts();
  }, [selectedStoreId]);

  const handleCreate = async (values: { storeId: string; name: string; price: number; stock: number; description: string; unit: ProductUnit }, imageFile: File | undefined): Promise<void> => {
    const input: CreateProductInput = {
      storeId: values.storeId,
      name: values.name,
      price: values.price,
      stock: values.stock,
      description: values.description || undefined,
      unit: values.unit,
      image: imageFile
    };
    try {
      await createProduct(input, token!);
      setShowForm(false);
      await fetchProducts();
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      throw error;
    }
  };

  const handleUpdate = async (values: { storeId: string; name: string; price: number; stock: number; description: string; unit: ProductUnit }): Promise<void> => {
    if (editingProduct === null) return;
    const input: UpdateProductInput = {
      storeId: values.storeId,
      name: values.name,
      price: values.price,
      stock: values.stock,
      description: values.description || undefined,
      unit: values.unit
    };
    try {
      await updateProduct(editingProduct.id, input, token!);
      setShowForm(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      throw error;
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (deletingProduct === null) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id, token!);
      setDeletingProduct(null);
      await fetchProducts();
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
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product): void => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = (): void => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} MAD`;
  };

  const columns: Column<Product>[] = [
    {
      header: 'Image',
      width: '80px',
      render: (product) => (
        <img
          src={createImageUrl(product.imageUrl)}
          alt={product.name}
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
      render: (product) => product.name
    },
    {
      header: 'Price',
      render: (product) => formatPrice(product.price)
    },
    {
      header: 'Stock',
      render: (product) => product.stock
    },
    {
      header: 'Unit',
      render: (product) => product.unit
    },
    {
      header: 'Actions',
      width: '120px',
      render: (product) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => { openEditForm(product); }}
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
            onClick={() => { setDeletingProduct(product); }}
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
          Products
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
          New Product
        </button>
      </div>

      {/* Store Filter */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="store-filter" style={{ fontSize: '14px', fontWeight: '500', color: '#1c1917', marginRight: '8px' }}>
          Filter by store:
        </label>
        <select
          id="store-filter"
          value={selectedStoreId}
          onChange={(e) => { setSelectedStoreId(e.target.value); }}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #d6d3d1',
            fontSize: '14px',
            color: '#1c1917',
            backgroundColor: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <option value="">All Stores</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <AdminTable<Product>
          columns={columns}
          data={products}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
          emptyMessage="No products found."
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
              maxWidth: '480px',
              maxHeight: '90vh',
              overflowY: 'auto' as const
            }}
            onClick={(e) => { e.stopPropagation(); }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1c1917', margin: '0 0 20px' }}>
              {editingProduct !== null ? 'Edit Product' : 'New Product'}
            </h2>
            <ProductForm
              initialValues={editingProduct !== null ? {
                storeId: editingProduct.storeId,
                name: editingProduct.name,
                price: editingProduct.price,
                stock: editingProduct.stock,
                description: editingProduct.description ?? '',
                unit: editingProduct.unit
              } : undefined}
              stores={stores}
              onSubmit={editingProduct !== null ? handleUpdate : handleCreate}
              onCancel={closeForm}
              submitLabel={editingProduct !== null ? 'Update' : 'Create'}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deletingProduct !== null}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"?`}
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => { setDeletingProduct(null); }}
      />
    </div>
  );
}
