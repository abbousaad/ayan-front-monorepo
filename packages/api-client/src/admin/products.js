import { API_BASE_URL } from '../client/config';
import { requestMultipart } from '../client/request-multipart';
import { requestJson } from '../shared/request-json';
import { parseProductResponse } from './validators';
export const createProduct = async (input, token) => {
    const formData = new FormData();
    formData.append('storeId', input.storeId);
    formData.append('name', input.name);
    formData.append('price', String(input.price));
    formData.append('stock', String(input.stock));
    if (input.description !== undefined) {
        formData.append('description', input.description);
    }
    if (input.unit !== undefined) {
        formData.append('unit', input.unit);
    }
    if (input.image !== undefined) {
        formData.append('image', input.image);
    }
    const response = await requestMultipart('/products', 'POST', formData, token);
    return parseProductResponse(response);
};
export const updateProduct = async (id, input, token) => {
    const response = await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, `/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    });
    return parseProductResponse(response);
};
export const deleteProduct = async (id, token) => {
    await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, `/products/${id}`, { method: 'DELETE' });
};
