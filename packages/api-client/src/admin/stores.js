import { API_BASE_URL } from '../client/config';
import { requestMultipart } from '../client/request-multipart';
import { requestJson } from '../shared/request-json';
import { parseStoreResponse } from './validators';
export const createStore = async (input, token) => {
    const formData = new FormData();
    formData.append('name', input.name);
    formData.append('category', input.category);
    formData.append('slug', input.slug);
    if (input.image !== undefined) {
        formData.append('image', input.image);
    }
    const response = await requestMultipart('/stores', 'POST', formData, token);
    return parseStoreResponse(response);
};
export const updateStore = async (id, input, token) => {
    const response = await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, `/stores/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    });
    return parseStoreResponse(response);
};
export const deleteStore = async (id, token) => {
    await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, `/stores/${id}`, { method: 'DELETE' });
};
