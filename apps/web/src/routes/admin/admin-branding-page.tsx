import { ApiClientError } from '@acme/api-client';
import { getBrandingSetting, updateBrandingSetting } from '@acme/api-client/admin';
import type { BrandingSettingInput } from '@acme/api-client/admin';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAdminAuth } from '../../admin/use-admin-auth';

type BrandingFormValues = {
  title: string;
  subtitle: string;
  image?: FileList;
};

export function AdminBrandingPage(): React.JSX.Element {
  const { token, handleUnauthorized } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>('');
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<BrandingFormValues>({ defaultValues: { title: '', subtitle: '' } });

  const imageFiles = watch('image');

  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(imageFiles[0]);
    } else {
      setPreviewLogoUrl(currentLogoUrl);
    }
  }, [imageFiles, currentLogoUrl]);

  useEffect(() => {
    const fetchBrandingSetting = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await getBrandingSetting();
        setCurrentLogoUrl(response.logoUrl);
        setPreviewLogoUrl(response.logoUrl);
        reset({
          title: response.title,
          subtitle: response.subtitle
        });
      } catch (error) {
        if (error instanceof ApiClientError && error.status === 401) { handleUnauthorized(); return; }
        setErrorMessage(error instanceof ApiClientError ? error.message : 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    void fetchBrandingSetting();
  }, []);

  const onSubmit = async (values: BrandingFormValues): Promise<void> => {
    setSuccessMessage(null);
    setErrorMessage(null);
    if (!token) { setErrorMessage('You must be signed in to update branding settings.'); return; }

    const input: BrandingSettingInput = {
      title: values.title,
      subtitle: values.subtitle
    };

    if (values.image && values.image.length > 0) {
      input.image = values.image[0];
    }

    try {
      const updated = await updateBrandingSetting(input, token);
      setCurrentLogoUrl(updated.logoUrl);
      reset({
        title: updated.title,
        subtitle: updated.subtitle,
        image: undefined
      });
      setSuccessMessage('Branding settings updated successfully.');
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) { handleUnauthorized(); return; }
      setErrorMessage(error instanceof ApiClientError ? error.message : 'An unexpected error occurred.');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1c1917', margin: '0 0 4px' }}>
        Branding Settings
      </h1>
      <p style={{ fontSize: '14px', color: '#78716c', margin: '0 0 20px' }}>
        Customize the store logo, title, and subtitle shown to customers
      </p>

      {(successMessage || errorMessage) && (
        <div
          role="alert"
          style={{
            backgroundColor: successMessage ? '#ecfdf3' : '#fef2f2',
            border: successMessage ? '1px solid #bbf7d0' : '1px solid #fecaca',
            color: successMessage ? '#166534' : '#b91c1c',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        >
          {successMessage ?? errorMessage}
        </div>
      )}

      <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Logo Section */}
          <div
            style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          >
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1c1917', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid #f5f5f4' }}>
              Logo
            </h2>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {/* Logo Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#1c1917', margin: 0 }}>
                  Current Logo
                </p>
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #d6d3d1'
                  }}
                >
                  {previewLogoUrl ? (
                    <img src={previewLogoUrl} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#a8a29e', fontSize: '12px' }}>No image</span>
                  )}
                </div>
              </div>

              {/* Upload Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label htmlFor="image" style={{ fontSize: '13px', fontWeight: '600', color: '#1c1917' }}>
                  Upload New Logo
                </label>
                <p style={{ fontSize: '12px', color: '#78716c', margin: 0, marginBottom: '8px' }}>
                  PNG, JPG or SVG. Max 10MB.
                </p>
                <input
                  id="image"
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  disabled={isLoading}
                  {...register('image')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d6d3d1',
                    fontSize: '14px',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                />
                {errors.image && (
                  <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                    {errors.image?.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Text Content Section */}
          <div
            style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          >
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1c1917', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid #f5f5f4' }}>
              Text Content
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="title" style={{ fontSize: '13px', fontWeight: '600', color: '#1c1917' }}>
                  Store Title
                </label>
                <p style={{ fontSize: '12px', color: '#78716c', margin: 0 }}>e.g., "Ayan Market"</p>
                <input
                  id="title"
                  type="text"
                  disabled={isLoading}
                  {...register('title', { required: 'Store title is required' })}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: errors.title ? '2px solid #f87171' : '1px solid #d6d3d1',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.title && (
                  <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                    {errors.title?.message}
                  </span>
                )}
              </div>

              {/* Subtitle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="subtitle" style={{ fontSize: '13px', fontWeight: '600', color: '#1c1917' }}>
                  Store Subtitle
                </label>
                <p style={{ fontSize: '12px', color: '#78716c', margin: 0 }}>e.g., "Fresh essentials"</p>
                <input
                  id="subtitle"
                  type="text"
                  disabled={isLoading}
                  {...register('subtitle', { required: 'Store subtitle is required' })}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: errors.subtitle ? '2px solid #f87171' : '1px solid #d6d3d1',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.subtitle && (
                  <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                    {errors.subtitle?.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            style={{
              padding: '10px 20px', borderRadius: '6px', border: 'none',
              backgroundColor: isSubmitting || isLoading ? '#a7c4b8' : '#1f6446',
              color: '#ffffff', fontSize: '14px', fontWeight: '600',
              cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Branding'}
          </button>
          {isLoading && <span style={{ fontSize: '13px', color: '#78716c' }}>Loading…</span>}
        </div>
      </form>
    </div>
  );
}
