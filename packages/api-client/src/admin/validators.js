import { ApiClientError } from '../shared/api-client-error';
import { STORE_CATEGORIES } from '../stores/types';
import { PRODUCT_UNITS } from '../products/types';
// ── Shared helpers ────────────────────────────────────────────────────────────
const isRecord = (value) => typeof value === 'object' && value !== null;
// ── Auth validators ───────────────────────────────────────────────────────────
const isUserRole = (value) => value === 'user' || value === 'superadmin' || value === 'livreur';
export const isAuthUser = (value) => {
    if (!isRecord(value)) {
        return false;
    }
    return (typeof value.id === 'string' &&
        typeof value.username === 'string' &&
        isUserRole(value.role) &&
        (value.mustChangePassword === undefined || typeof value.mustChangePassword === 'boolean'));
};
export const isAdminLoginResponse = (value) => {
    if (!isRecord(value) || !isRecord(value.data)) {
        return false;
    }
    return (typeof value.data.token === 'string' &&
        isAuthUser(value.data.user));
};
export const parseAdminLoginResponse = (value) => {
    if (!isAdminLoginResponse(value)) {
        throw new ApiClientError({
            code: 'INVALID_LOGIN_RESPONSE',
            message: 'The login response did not match the expected format.'
        });
    }
    return value;
};
// ── Store validators ──────────────────────────────────────────────────────────
const isStoreCategory = (value) => typeof value === 'string' && STORE_CATEGORIES.includes(value);
export const isStore = (value) => {
    if (!isRecord(value)) {
        return false;
    }
    return (typeof value.id === 'string' &&
        typeof value.name === 'string' &&
        typeof value.slug === 'string' &&
        typeof value.imageUrl === 'string' &&
        isStoreCategory(value.category));
};
export const parseStoreResponse = (value) => {
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
const isProductUnit = (value) => typeof value === 'string' && PRODUCT_UNITS.includes(value);
export const isProduct = (value) => {
    if (!isRecord(value)) {
        return false;
    }
    return (typeof value.id === 'string' &&
        typeof value.storeId === 'string' &&
        typeof value.name === 'string' &&
        typeof value.price === 'number' &&
        typeof value.stock === 'number' &&
        typeof value.imageUrl === 'string' &&
        (value.description === null || typeof value.description === 'string' || value.description === undefined) &&
        isProductUnit(value.unit));
};
export const parseProductResponse = (value) => {
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
const isDiscountType = (value) => value === 'fixed' || value === 'percentage';
export const isCoupon = (value) => {
    if (!isRecord(value)) {
        return false;
    }
    return (typeof value.id === 'string' &&
        typeof value.code === 'string' &&
        isDiscountType(value.discountType) &&
        typeof value.discountValue === 'number' &&
        typeof value.startsAt === 'string' &&
        typeof value.endsAt === 'string' &&
        typeof value.isActive === 'boolean' &&
        (value.maxUses === null || typeof value.maxUses === 'number') &&
        typeof value.usedCount === 'number');
};
export const parseCouponResponse = (value) => {
    const data = isRecord(value) && 'data' in value ? value.data : value;
    if (!isCoupon(data)) {
        throw new ApiClientError({
            code: 'INVALID_COUPON_RESPONSE',
            message: 'The coupon response did not match the expected format.'
        });
    }
    return data;
};
export const parseCouponsResponse = (value) => {
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
export const isPricingConfig = (value) => {
    if (!isRecord(value)) {
        return false;
    }
    return (typeof value.deliveryFee === 'number' &&
        typeof value.serviceFeeRate === 'number' &&
        typeof value.taxRate === 'number' &&
        typeof value.discountRate === 'number');
};
export const parsePricingConfigResponse = (value) => {
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
export const isCurrencySetting = (value) => {
    if (!isRecord(value)) {
        return false;
    }
    return typeof value.currencyCode === 'string';
};
export const parseCurrencySettingResponse = (value) => {
    const data = isRecord(value) && 'data' in value ? value.data : value;
    if (!isCurrencySetting(data)) {
        throw new ApiClientError({
            code: 'INVALID_CURRENCY_SETTING_RESPONSE',
            message: 'The currency setting response did not match the expected format.'
        });
    }
    return data;
};
