import { PRODUCT_UNITS } from '@acme/api-client/products';
import type { ProductUnit } from '@acme/api-client/products';
import type { Store } from '@acme/api-client/stores';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ProductFormValues = {
  storeId: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  unit: ProductUnit;
};

type ProductFormProps = {
  initialValues?: ProductFormValues;
  stores: Store[];
  onSubmit: (values: ProductFormValues, imageFile: File | undefined) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};

const inputStyle = {
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #d6d3d1',
  fontSize: '14px',
  color: '#1c1917',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box' as const
};

const errorInputStyle = {
  ...inputStyle,
  border: '1px solid #f87171'
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '500' as const,
  color: '#1c1917'
};

export function ProductForm({
  initialValues,
  stores,
  onSubmit,
  onCancel,
  submitLabel = 'Save'
}: ProductFormProps): React.JSX.Element {
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormValues>({
    defaultValues: initialValues ?? {
      storeId: stores[0]?.id ?? '',
      name: '',
      price: 0,
      stock: 0,
      description: '',
      unit: 'unit'
    }
  });

  const handleFormSubmit = async (values: ProductFormValues): Promise<void> => {
    setApiError(null);
    try {
      await onSubmit(values, imageFile);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form
      onSubmit={(e) => { void handleSubmit(handleFormSubmit)(e); }}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {apiError !== null && (
        <div
          role="alert"
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '14px',
            color: '#b91c1c'
          }}
        >
          {apiError}
        </div>
      )}

      {/* Store */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="product-store" style={labelStyle}>Store</label>
        <select
          id="product-store"
          {...register('storeId', { required: 'Store is required' })}
          style={inputStyle}
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="product-name" style={labelStyle}>Name</label>
        <input
          id="product-name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          style={errors.name ? errorInputStyle : inputStyle}
        />
        {errors.name && (
          <span style={{ fontSize: '12px', color: '#b91c1c' }}>{errors.name.message}</span>
        )}
      </div>

      {/* Price */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="product-price" style={labelStyle}>Price (MAD)</label>
        <input
          id="product-price"
          type="number"
          step="0.01"
          min="0"
          {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })}
          style={errors.price ? errorInputStyle : inputStyle}
        />
        {errors.price && (
          <span style={{ fontSize: '12px', color: '#b91c1c' }}>{errors.price.message}</span>
        )}
      </div>

      {/* Stock */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="product-stock" style={labelStyle}>Stock</label>
        <input
          id="product-stock"
          type="number"
          min="0"
          {...register('stock', { required: 'Stock is required', min: { value: 0, message: 'Stock must be non-negative' }, valueAsNumber: true })}
          style={errors.stock ? errorInputStyle : inputStyle}
        />
        {errors.stock && (
          <span style={{ fontSize: '12px', color: '#b91c1c' }}>{errors.stock.message}</span>
        )}
      </div>

      {/* Unit */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="product-unit" style={labelStyle}>Unit</label>
        <select
          id="product-unit"
          {...register('unit', { required: 'Unit is required' })}
          style={inputStyle}
        >
          {PRODUCT_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="product-description" style={labelStyle}>Description</label>
        <textarea
          id="product-description"
          rows={3}
          {...register('description')}
          style={inputStyle}
        />
      </div>

      {/* Image */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="product-image" style={labelStyle}>
          Image {initialValues ? '(optional — leave empty to keep current)' : '(optional)'}
        </label>
        <input
          id="product-image"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0])}
          style={inputStyle}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: '1px solid #d6d3d1',
            backgroundColor: '#ffffff',
            fontSize: '14px',
            color: '#1c1917',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: isSubmitting ? '#a7c4b8' : '#1f6446',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}