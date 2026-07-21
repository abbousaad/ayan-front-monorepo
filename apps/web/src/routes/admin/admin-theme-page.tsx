import { ApiClientError } from '@acme/api-client';
import { getThemeSetting, updateThemeSetting } from '@acme/api-client/admin';
import type { ThemeSettingInput } from '@acme/api-client/admin';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAdminAuth } from '../../admin/use-admin-auth';

type ThemeFormValues = {
  primaryColor: string;
  textColor: string;
  secondaryColor: string;
  subtitle1Color: string;
  subtitle2Color: string;
};

const COLOR_DESCRIPTIONS = {
  primaryColor: 'Main background color',
  textColor: 'Main text color',
  secondaryColor: 'Buttons and hover state color',
  subtitle1Color: 'Secondary text color',
  subtitle2Color: 'Tertiary text color'
};

export function AdminThemePage(): React.JSX.Element {
  const { token, handleUnauthorized } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ThemeFormValues>({
    defaultValues: {
      primaryColor: '#1f2937',
      textColor: '#000000',
      secondaryColor: '#3b82f6',
      subtitle1Color: '#4b5563',
      subtitle2Color: '#9ca3af'
    }
  });

  const watchColors = watch();

  const fetchThemeSetting = async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getThemeSetting();
      reset({
        primaryColor: response.primaryColor,
        textColor: response.textColor,
        secondaryColor: response.secondaryColor,
        subtitle1Color: response.subtitle1Color,
        subtitle2Color: response.subtitle2Color
      });
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchThemeSetting();
  }, []);

  const onSubmit = async (values: ThemeFormValues): Promise<void> => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('You must be signed in to update theme settings.');
      return;
    }

    const input: ThemeSettingInput = {
      primaryColor: values.primaryColor.trim(),
      textColor: values.textColor.trim(),
      secondaryColor: values.secondaryColor.trim(),
      subtitle1Color: values.subtitle1Color.trim(),
      subtitle2Color: values.subtitle2Color.trim()
    };

    try {
      const updated = await updateThemeSetting(input, token);
      reset({
        primaryColor: updated.primaryColor,
        textColor: updated.textColor,
        secondaryColor: updated.secondaryColor,
        subtitle1Color: updated.subtitle1Color,
        subtitle2Color: updated.subtitle2Color
      });
      setSuccessMessage('Theme settings updated successfully.');
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        handleUnauthorized();
        return;
      }
      if (error instanceof ApiClientError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  const colorFields = [
    'primaryColor',
    'textColor',
    'secondaryColor',
    'subtitle1Color',
    'subtitle2Color'
  ] as const;

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1c1917', margin: '0 0 12px' }}>
        Theme Settings
      </h1>
      <p style={{ fontSize: '14px', color: '#78716c', margin: '0 0 20px' }}>
        Customize the store appearance for your customers
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

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <form
          onSubmit={(event) => { void handleSubmit(onSubmit)(event); }}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {colorFields.map((field) => (
              <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label
                  htmlFor={field}
                  style={{ fontSize: '14px', fontWeight: '600', color: '#1c1917' }}
                >
                  {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </label>
                <p style={{ fontSize: '12px', color: '#78716c', margin: '0 0 8px' }}>
                  {COLOR_DESCRIPTIONS[field as keyof typeof COLOR_DESCRIPTIONS]}
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    id={field}
                    type="color"
                    aria-invalid={errors[field] !== undefined}
                    disabled={isLoading}
                    {...register(field as keyof ThemeFormValues, {
                      required: `${field} is required`,
                      pattern: {
                        value: /^#[0-9a-fA-F]{6}$/,
                        message: 'Must be a valid hex color (e.g. #1f2937)'
                      }
                    })}
                    style={{
                      width: '60px',
                      height: '40px',
                      borderRadius: '6px',
                      border: errors[field] ? '2px solid #f87171' : '1px solid #d6d3d1',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={watchColors[field as keyof ThemeFormValues]}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d6d3d1',
                      fontSize: '14px',
                      color: '#1c1917',
                      backgroundColor: '#f5f5f5',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
                {errors[field] && (
                  <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                    {errors[field]?.message}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '12px' }}>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              style={{
                padding: '10px 18px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isSubmitting || isLoading ? '#a7c4b8' : '#1f6446',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Theme'}
            </button>
            {isLoading && (
              <span style={{ fontSize: '13px', color: '#78716c' }}>
                Loading theme settings...
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Preview section */}
      <div
        style={{
          marginTop: '32px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1c1917', margin: '0 0 16px' }}>
          Theme Preview
        </h2>
        <div
          style={{
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: watchColors.primaryColor,
            color: watchColors.textColor
          }}
        >
          <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '700' }}>
            Main Title
          </h3>
          <p style={{ margin: '0 0 12px', fontSize: '14px', color: watchColors.subtitle1Color }}>
            Secondary text would appear here
          </p>
          <button
            type="button"
            style={{
              padding: '10px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: watchColors.secondaryColor,
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Example Button
          </button>
          <p style={{ margin: '12px 0 0', fontSize: '12px', color: watchColors.subtitle2Color }}>
            Tertiary text for smaller details
          </p>
        </div>
      </div>
    </div>
  );
}
