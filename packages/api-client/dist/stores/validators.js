import { ApiClientError } from '../shared/api-client-error';
import { STORE_CATEGORIES } from './types';
const isRecord = (value) => typeof value === 'object' && value !== null;
const isStoreCategory = (value) => typeof value === 'string' && STORE_CATEGORIES.includes(value);
const isStore = (value) => {
    if (!isRecord(value)) {
        return false;
    }
    return (typeof value.id === 'string' &&
        typeof value.name === 'string' &&
        typeof value.slug === 'string' &&
        typeof value.imageUrl === 'string' &&
        isStoreCategory(value.category));
};
export const parseStoresResponse = (value) => {
    if (!isRecord(value) || !Array.isArray(value.data) || !value.data.every(isStore)) {
        throw new ApiClientError({
            code: 'INVALID_STORES_RESPONSE',
            message: 'The stores response did not match the expected format.'
        });
    }
    return {
        data: value.data
    };
};
export const parseStoreResponse = (value) => {
    if (isRecord(value) && 'data' in value && isStore(value.data)) {
        return {
            data: value.data
        };
    }
    if (isStore(value)) {
        return {
            data: value
        };
    }
    throw new ApiClientError({
        code: 'INVALID_STORE_RESPONSE',
        message: 'The store response did not match the expected format.'
    });
};
//# sourceMappingURL=validators.js.map