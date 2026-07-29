import { ApiClientError } from '../shared/api-client-error';
import { STORE_CATEGORIES } from '../stores/types';
import { PRODUCT_UNITS } from '../products/types';
import type { Store } from '../stores/types';
import type { Product } from '../products/types';

import type {
  AdminLoginResponse,
  AuthUser,
  Coupon,
  CurrencySetting,
  DiscountType,
  PricingConfig,
  UserRole,
  ThemeSetting,
  TranslationSetting,
  Locale,
  BrandingSetting,
} from './types';

// ── Shared helpers ────────────────────────────────────────────────────────────

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

// ── Auth validators ───────────────────────────────────────────────────────────

const isUserRole = (value: unknown): value is UserRole =>
  value === 'user' || value === 'superadmin' || value === 'livreur';

export const isAuthUser = (value: unknown): value is AuthUser => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.username === 'string' &&
    isUserRole(value.role) &&
    (value.mustChangePassword === undefined || typeof value.mustChangePassword === 'boolean')
  );
};

export const isAdminLoginResponse = (value: unknown): value is AdminLoginResponse => {
  if (!isRecord(value) || !isRecord(value.data)) {
    return false;
  }

  return (
    typeof value.data.token === 'string' &&
    isAuthUser(value.data.user)
  );
};

export const parseAdminLoginResponse = (value: unknown): AdminLoginResponse => {
  if (!isAdminLoginResponse(value)) {
    throw new ApiClientError({
      code: 'INVALID_LOGIN_RESPONSE',
      message: 'The login response did not match the expected format.'
    });
  }

  return value;
};

// ── Store validators ──────────────────────────────────────────────────────────

const isStoreCategory = (value: unknown): value is Store['category'] =>
  typeof value === 'string' && STORE_CATEGORIES.includes(value as Store['category']);

export const isStore = (value: unknown): value is Store => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.imageUrl === 'string' &&
    isStoreCategory(value.category)
  );
};

export const parseStoreResponse = (value: unknown): Store => {
  const data = isRecord(value) && 'data' in value ? value.data : value;

  if (!isStore(data)) {
    throw new ApiClientError({
      code: 'INVALID_STORE_RESPONSE',
      message: 'The store response did not match the expected format.'
    });
  }

  return data;
};

// ── Product validators ────────────────────────────────────────────────────────

const isProductUnit = (value: unknown): value is Product['unit'] =>
  typeof value === 'string' && PRODUCT_UNITS.includes(value as Product['unit']);

export const isProduct = (value: unknown): value is Product => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.storeId === 'string' &&
    typeof value.name === 'string' &&
    typeof value.price === 'number' &&
    typeof value.stock === 'number' &&
    typeof value.imageUrl === 'string' &&
    (value.description === null || typeof value.description === 'string' || value.description === undefined) &&
    isProductUnit(value.unit)
  );
};

export const parseProductResponse = (value: unknown): Product => {
  const data = isRecord(value) && 'data' in value ? value.data : value;

  if (!isProduct(data)) {
    throw new ApiClientError({
      code: 'INVALID_PRODUCT_RESPONSE',
      message: 'The product response did not match the expected format.'
    });
  }

  return {
    ...data,
    description: data.description ?? null,
  };
};

// ── Coupon validators ─────────────────────────────────────────────────────────

const isDiscountType = (value: unknown): value is DiscountType =>
  value === 'fixed' || value === 'percentage';

export const isCoupon = (value: unknown): value is Coupon => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.code === 'string' &&
    isDiscountType(value.discountType) &&
    typeof value.discountValue === 'number' &&
    typeof value.startsAt === 'string' &&
    typeof value.endsAt === 'string' &&
    typeof value.isActive === 'boolean' &&
    (value.maxUses === null || typeof value.maxUses === 'number') &&
    typeof value.usedCount === 'number'
  );
};

export const parseCouponResponse = (value: unknown): Coupon => {
  const data = isRecord(value) && 'data' in value ? value.data : value;

  if (!isCoupon(data)) {
    throw new ApiClientError({
      code: 'INVALID_COUPON_RESPONSE',
      message: 'The coupon response did not match the expected format.'
    });
  }

  return data;
};

export const parseCouponsResponse = (value: unknown): Coupon[] => {
  const data = isRecord(value) && 'data' in value ? value.data : value;

  if (!Array.isArray(data) || !data.every(isCoupon)) {
    throw new ApiClientError({
      code: 'INVALID_COUPONS_RESPONSE',
      message: 'The coupons response did not match the expected format.'
    });
  }

  return data;
};

// ── Pricing config validators ─────────────────────────────────────────────────

export const isPricingConfig = (value: unknown): value is PricingConfig => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.deliveryFee === 'number' &&
    typeof value.serviceFeeRate === 'number' &&
    typeof value.taxRate === 'number' &&
    typeof value.discountRate === 'number'
  );
};

export const parsePricingConfigResponse = (value: unknown): PricingConfig => {
  const data = isRecord(value) && 'data' in value ? value.data : value;

  if (!isPricingConfig(data)) {
    throw new ApiClientError({
      code: 'INVALID_PRICING_CONFIG_RESPONSE',
      message: 'The pricing config response did not match the expected format.'
    });
  }

  return data;
};

// ── Currency settings validators ──────────────────────────────────────────────

export const isCurrencySetting = (value: unknown): value is CurrencySetting => {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.currencyCode === 'string';
};

export const parseCurrencySettingResponse = (value: unknown): CurrencySetting => {
  const data = isRecord(value) && 'data' in value ? value.data : value;

  if (!isCurrencySetting(data)) {
    throw new ApiClientError({
      code: 'INVALID_CURRENCY_SETTING_RESPONSE',
      message: 'The currency setting response did not match the expected format.'
    });
  }

  return data;
};

// ── Theme settings validators ────────────────────────────────────────────────

const isHexColor = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  return /^#[0-9a-fA-F]{6}$/.test(value);
};

export const isThemeSetting = (value: unknown): value is ThemeSetting => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isHexColor(value.primaryColor) &&
    isHexColor(value.textColor) &&
    isHexColor(value.secondaryColor) &&
    isHexColor(value.subtitle1Color) &&
    isHexColor(value.subtitle2Color) &&
    isHexColor(value.logoTitleColor) &&
    isHexColor(value.logoSubtitleColor) &&
    isHexColor(value.mainButtonBgColor) &&
    isHexColor(value.secButtonBgColor) &&
    isHexColor(value.homeSubtitleTextColor) &&
    isHexColor(value.homeTitleColor) &&
    isHexColor(value.accentColor) &&
    isHexColor(value.cardBgColor) &&
    isHexColor(value.checkoutButtonBgColor) &&
    isHexColor(value.cartTitleColor) &&
    isHexColor(value.sectionTitleColor) &&
    isHexColor(value.bodyTextColor) &&
    isHexColor(value.priceColor) &&
    isHexColor(value.pageBgColor) &&
    isHexColor(value.navBgColor)
  );
};

export const parseThemeSettingResponse = (value: unknown): ThemeSetting => {
  const data = isRecord(value) && 'data' in value ? value.data : value;

  if (!isThemeSetting(data)) {
    throw new ApiClientError({
      code: 'INVALID_THEME_SETTING_RESPONSE',
      message: 'The theme setting response did not match the expected format.'
    });
  }

  return data;
};

// ── Translation settings validators ───────────────────────────────────────────

const LOCALE_VALUES: readonly Locale[] = ['en', 'fr', 'ar'];

const isValidatorLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALE_VALUES as readonly string[]).includes(value);

const isTranslationBundle = (value: unknown): value is Record<string, string> => {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((entry) => typeof entry === 'string');
};

export const isTranslationSetting = (value: unknown): value is TranslationSetting => {
  if (!isRecord(value)) {
    return false;
  }

  if (!isValidatorLocale(value.defaultLocale)) {
    return false;
  }

  if (!Array.isArray(value.activeLocales) || !value.activeLocales.every(isValidatorLocale)) {
    return false;
  }

  if (!isRecord(value.translations)) {
    return false;
  }

  return Object.values(value.translations).every(isTranslationBundle);
};

export const parseTranslationSettingResponse = (value: unknown): TranslationSetting => {
  const data = isRecord(value) && 'data' in value ? value.data : value;

  if (!isTranslationSetting(data)) {
    throw new ApiClientError({
      code: 'INVALID_TRANSLATION_SETTING_RESPONSE',
      message: 'The translation setting response did not match the expected format.'
    });
  }

  return data;
};

// ── Branding settings validators ─────────────────────────────────────────────

export const isBrandingSetting = (value: unknown): value is BrandingSetting => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (typeof value.logoUrl === 'string' || value.logoUrl === null) &&
    typeof value.title === 'string' &&
    typeof value.subtitle === 'string'
  );
};

export const parseBrandingSettingResponse = (value: unknown): BrandingSetting => {
  const data = isRecord(value) && 'data' in value ? value.data : value;

  if (!isBrandingSetting(data)) {
    throw new ApiClientError({
      code: 'INVALID_BRANDING_SETTING_RESPONSE',
      message: 'The branding setting response did not match the expected format.'
    });
  }

  return data;
};
