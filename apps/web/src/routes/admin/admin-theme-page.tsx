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
  logoTitleColor: string;
  logoSubtitleColor: string;
  mainButtonBgColor: string;
  secButtonBgColor: string;
  homeSubtitleTextColor: string;
  homeTitleColor: string;
  accentColor: string;
  cardBgColor: string;
  checkoutButtonBgColor: string;
  cartTitleColor: string;
  sectionTitleColor: string;
  bodyTextColor: string;
  priceColor: string;
  pageBgColor: string;
  navBgColor: string;
};

type ColorField = keyof ThemeFormValues;

type ColorGroup = {
  label: string;
  fields: { key: ColorField; label: string; description: string }[];
};

const COLOR_GROUPS: ColorGroup[] = [
  {
    label: 'Navbar',
    fields: [
      { key: 'navBgColor', label: 'Background', description: 'Navbar background color' },
      { key: 'logoTitleColor', label: 'Logo Title', description: '"Ayan Market" text' },
      { key: 'logoSubtitleColor', label: 'Logo Subtitle', description: '"Fresh essentials" text' },
      { key: 'mainButtonBgColor', label: 'Main Button', description: '"S\'enregistrer" button background' },
      { key: 'secButtonBgColor', label: 'Cart Badge', description: 'Cart item count badge' },
    ]
  },
  {
    label: 'Home Page',
    fields: [
      { key: 'pageBgColor', label: 'Page Background', description: 'Home, products, product detail page background' },
      { key: 'homeSubtitleTextColor', label: 'Section Label', description: '"Fresh arrivals" / "Product collection" labels' },
      { key: 'homeTitleColor', label: 'Hero Title', description: '"Shop neighborhood stores…" heading' },
      { key: 'sectionTitleColor', label: 'Section Titles', description: '"Choose a store", "Explore everything…" headings' },
      { key: 'bodyTextColor', label: 'Body Text', description: 'Paragraph and description text' },
      { key: 'cardBgColor', label: 'Card Background', description: 'Store cards, cart item cards, cart summary panel' },
    ]
  },
  {
    label: 'Store & Products',
    fields: [
      { key: 'accentColor', label: 'Accent / Labels', description: 'All small uppercase labels site-wide' },
      { key: 'primaryColor', label: 'Store Page Background', description: 'Store products page background' },
      { key: 'textColor', label: 'Product Name', description: 'Product names and headings in product cards' },
      { key: 'priceColor', label: 'Price', description: 'Product price on the product detail page' },
      { key: 'subtitle1Color', label: 'Subtitle 1', description: 'Product descriptions' },
      { key: 'subtitle2Color', label: 'Subtitle 2', description: 'Price units (e.g. /kg)' },
      { key: 'secondaryColor', label: 'Add to Cart Button', description: 'Add to cart button in product cards' },
    ]
  },
  {
    label: 'Cart & Checkout',
    fields: [
      { key: 'cartTitleColor', label: 'Cart Title', description: '"Your selections" heading in cart drawer' },
      { key: 'checkoutButtonBgColor', label: 'Checkout Button', description: '"Continue" and "Add to cart" primary buttons' },
    ]
  }
];

const DEFAULT_VALUES: ThemeFormValues = {
  primaryColor: '#1f2937',
  textColor: '#000000',
  secondaryColor: '#3b82f6',
  subtitle1Color: '#4b5563',
  subtitle2Color: '#9ca3af',
  logoTitleColor: '#0c0a09',
  logoSubtitleColor: '#1f6446',
  mainButtonBgColor: '#1f6446',
  secButtonBgColor: '#1f6446',
  homeSubtitleTextColor: '#b45309',
  homeTitleColor: '#0c0a09',
  accentColor: '#b45309',
  cardBgColor: '#fbf7f1',
  checkoutButtonBgColor: '#1f6446',
  cartTitleColor: '#0c0a09',
  sectionTitleColor: '#0c0a09',
  bodyTextColor: '#44403c',
  priceColor: '#0c0a09',
  pageBgColor: '#ffffff',
  navBgColor: '#ffffff',
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
  } = useForm<ThemeFormValues>({ defaultValues: DEFAULT_VALUES });

  const watchColors = watch();

  useEffect(() => {
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
          subtitle2Color: response.subtitle2Color,
          logoTitleColor: response.logoTitleColor,
          logoSubtitleColor: response.logoSubtitleColor,
          mainButtonBgColor: response.mainButtonBgColor,
          secButtonBgColor: response.secButtonBgColor,
          homeSubtitleTextColor: response.homeSubtitleTextColor,
          homeTitleColor: response.homeTitleColor,
          accentColor: response.accentColor,
          cardBgColor: response.cardBgColor,
          checkoutButtonBgColor: response.checkoutButtonBgColor,
          cartTitleColor: response.cartTitleColor,
          sectionTitleColor: response.sectionTitleColor,
          bodyTextColor: response.bodyTextColor,
          priceColor: response.priceColor,
          pageBgColor: response.pageBgColor,
          navBgColor: response.navBgColor,
        });
      } catch (error) {
        if (error instanceof ApiClientError && error.status === 401) { handleUnauthorized(); return; }
        setErrorMessage(error instanceof ApiClientError ? error.message : 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    void fetchThemeSetting();
  }, []);

  const onSubmit = async (values: ThemeFormValues): Promise<void> => {
    setSuccessMessage(null);
    setErrorMessage(null);
    if (!token) { setErrorMessage('You must be signed in to update theme settings.'); return; }

    const input: ThemeSettingInput = {
      primaryColor: values.primaryColor,
      textColor: values.textColor,
      secondaryColor: values.secondaryColor,
      subtitle1Color: values.subtitle1Color,
      subtitle2Color: values.subtitle2Color,
      logoTitleColor: values.logoTitleColor,
      logoSubtitleColor: values.logoSubtitleColor,
      mainButtonBgColor: values.mainButtonBgColor,
      secButtonBgColor: values.secButtonBgColor,
      homeSubtitleTextColor: values.homeSubtitleTextColor,
      homeTitleColor: values.homeTitleColor,
      accentColor: values.accentColor,
      cardBgColor: values.cardBgColor,
      checkoutButtonBgColor: values.checkoutButtonBgColor,
      cartTitleColor: values.cartTitleColor,
      sectionTitleColor: values.sectionTitleColor,
      bodyTextColor: values.bodyTextColor,
      priceColor: values.priceColor,
      pageBgColor: values.pageBgColor,
      navBgColor: values.navBgColor,
    };

    try {
      const updated = await updateThemeSetting(input, token);
      reset({ ...updated });
      setSuccessMessage('Theme settings updated successfully.');
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) { handleUnauthorized(); return; }
      setErrorMessage(error instanceof ApiClientError ? error.message : 'An unexpected error occurred.');
    }
  };

  const hexPattern = { value: /^#[0-9a-fA-F]{6}$/, message: 'Must be a valid hex color (#RRGGBB)' };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1c1917', margin: '0 0 4px' }}>
        Theme Settings
      </h1>
      <p style={{ fontSize: '14px', color: '#78716c', margin: '0 0 20px' }}>
        Customize the store appearance seen by customers
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
          {COLOR_GROUPS.map((group) => (
            <div
              key={group.label}
              style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1c1917', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid #f5f5f4' }}>
                {group.label}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {group.fields.map(({ key, label, description }) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor={key} style={{ fontSize: '13px', fontWeight: '600', color: '#1c1917' }}>
                      {label}
                    </label>
                    <p style={{ fontSize: '12px', color: '#78716c', margin: 0 }}>{description}</p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <input
                        id={key}
                        type="color"
                        disabled={isLoading}
                        {...register(key, { required: `${label} is required`, pattern: hexPattern })}
                        style={{
                          width: '48px', height: '36px', borderRadius: '6px', cursor: 'pointer',
                          border: errors[key] ? '2px solid #f87171' : '1px solid #d6d3d1'
                        }}
                      />
                      <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#57534e' }}>
                        {watchColors[key]}
                      </span>
                    </div>
                    {errors[key] && (
                      <span role="alert" style={{ fontSize: '12px', color: '#b91c1c' }}>
                        {errors[key]?.message}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
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
            {isSubmitting ? 'Saving...' : 'Save Theme'}
          </button>
          {isLoading && <span style={{ fontSize: '13px', color: '#78716c' }}>Loading…</span>}
        </div>
      </form>
    </div>
  );
}
