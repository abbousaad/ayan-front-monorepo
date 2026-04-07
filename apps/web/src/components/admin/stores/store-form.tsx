import { STORE_CATEGORIES } from '@acme/api-client/stores';
import type { StoreCategory } from '@acme/api-client/stores';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type StoreFormValues = {
  name: string;
  category: StoreCategory;
  slug: string;
};

type StoreFormProps = {
  initialValues?: StoreFormValues;
  onSubmit: (values: StoreFormValues, imageFile: File | undefined) => Promise<void>;
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

export function StoreForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save'
}: StoreFormProps): React.JSX.Element {
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<StoreFormValues>({
    defaultValues: initialValues ?? { name: '', category: 'fruits', slug: '' }
  });

  const handleFormSubmit = async (values: StoreFormValues): Promise<void> => {
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

      {/* Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="store-name" style={labelStyle}>Name</label>
        <input
          id="store-name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          style={errors.name ? errorInputStyle : inputStyle}
        />
        {errors.name && (
          <span style={{ fontSize: '12px', color: '#b91c1c' }}>{errors.name.message}</span>
        )}
      </div>

      {/* Category */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="store-category" style={labelStyle}>Category</label>
        <select
          id="store-category"
          {...register('category', { required: 'Category is required' })}
          style={inputStyle}
        >
          {STORE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Slug */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="store-slug" style={labelStyle}>Slug</label>
        <input
          id="store-slug"
          type="text"
          {...register('slug', { required: 'Slug is required' })}
          style={errors.slug ? errorInputStyle : inputStyle}
        />
        {errors.slug && (
          <span style={{ fontSize: '12px', color: '#b91c1c' }}>{errors.slug.message}</span>
        )}
      </div>

      {/* Image */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="store-image" style={labelStyle}>
          Image {initialValues ? '(optional — leave empty to keep current)' : '(optional)'}
        </label>
        <input
          id="store-image"
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
