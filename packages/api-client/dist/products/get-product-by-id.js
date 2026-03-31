import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';
import { parseProductResponse } from './validators';
export const getProductById = async (productId) => {
    const response = await requestJson({ baseUrl: API_BASE_URL }, `/products/${productId}`);
    return parseProductResponse(response);
};
//# sourceMappingURL=get-product-by-id.js.map