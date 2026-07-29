import type { StoreCategory } from '../stores/types';
import type { ProductUnit } from '../products/types';

// ── Auth types ──────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'superadmin' | 'livreur';

export type AuthUser = {
  id: string;
  username: string;
  role: UserRole;
  mustChangePassword?: boolean;
};

export type AdminLoginResponse = {
  data: {
    token: string;
    user: AuthUser;
  };
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

// ── Store input types ────────────────────────────────────────────────────────

export type CreateStoreInput = {
  name: string;
  category: StoreCategory;
  slug: string;
  image?: File;
};

export type UpdateStoreInput = {
  name?: string;
  category?: StoreCategory;
  slug?: string;
};

// ── Product input types ──────────────────────────────────────────────────────

export type CreateProductInput = {
  storeId: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  unit?: ProductUnit;
  image?: File;
};

export type UpdateProductInput = {
  storeId?: string;
  name?: string;
  price?: number;
  stock?: number;
  description?: string;
  unit?: ProductUnit;
};

// ── Coupon types ─────────────────────────────────────────────────────────────

export type DiscountType = 'fixed' | 'percentage';

export type Coupon = {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  maxUses: number | null;
  usedCount: number;
};

export type CouponInput = {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  startsAt: string;
  endsAt: string;
  isActive?: boolean;
  maxUses?: number | null;
};

export type UpdateCouponInput = Partial<CouponInput>;

// ── Pricing config types ─────────────────────────────────────────────────────

export type PricingConfig = {
  deliveryFee: number;
  serviceFeeRate: number;
  taxRate: number;
  discountRate: number;
};

export type UpdatePricingConfigInput = Partial<PricingConfig>;

// ── Public orders types ──────────────────────────────────────────────────────

export type PublicOrderStatus = 'pending' | 'onpreparation' | 'ondelivery' | 'paid';

export type PublicOrder = {
  id: string;
  status: PublicOrderStatus;
  [key: string]: unknown;
};

// ── Currency settings types ───────────────────────────────────────────────────

export type CurrencySetting = {
  currencyCode: string;
};

export type CurrencySettingInput = {
  currencyCode: string;
};

// ── Translation settings types ────────────────────────────────────────────────

export type Locale = 'en' | 'fr' | 'ar';

export type TranslationBundle = Record<string, string>;

export type TranslationSetting = {
  defaultLocale: Locale;
  activeLocales: Locale[];
  translations: Record<Locale, TranslationBundle>;
};

export type TranslationSettingInput = {
  defaultLocale?: Locale;
  activeLocales?: Locale[];
  translations?: Partial<Record<Locale, TranslationBundle>>;
};

// ── Theme settings types ──────────────────────────────────────────────────────

export type ThemeSetting = {
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

export type ThemeSettingInput = {
  primaryColor?: string;
  textColor?: string;
  secondaryColor?: string;
  subtitle1Color?: string;
  subtitle2Color?: string;
  logoTitleColor?: string;
  logoSubtitleColor?: string;
  mainButtonBgColor?: string;
  secButtonBgColor?: string;
  homeSubtitleTextColor?: string;
  homeTitleColor?: string;
  accentColor?: string;
  cardBgColor?: string;
  checkoutButtonBgColor?: string;
  cartTitleColor?: string;
  sectionTitleColor?: string;
  bodyTextColor?: string;
  priceColor?: string;
  pageBgColor?: string;
  navBgColor?: string;
};

// ── Branding settings types ───────────────────────────────────────────────────

export type BrandingSetting = {
  logoUrl: string | null;
  title: string;
  subtitle: string;
};

export type BrandingSettingInput = {
  title?: string;
  subtitle?: string;
  image?: File;
};
