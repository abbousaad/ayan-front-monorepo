import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';
import { parseProductsResponse } from './validators';
const createProductsSearchParams = (query) => {
    const searchParams = [];
    if (query?.storeId) {
        searchParams.push(`storeId=${encodeURIComponent(query.storeId)}`);
    }
    return searchParams.join('&');
};
export const getProducts = async (query) => {
    const response = await requestJson({ baseUrl: API_BASE_URL }, '/products', undefined, createProductsSearchParams(query));
    return parseProductsResponse(response);
};
//# sourceMappingURL=get-products.js.map