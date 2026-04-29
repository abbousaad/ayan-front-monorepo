import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';
import { parseStoresResponse } from './validators';
export const getStores = async () => {
    const response = await requestJson({ baseUrl: API_BASE_URL }, '/stores');
    return parseStoresResponse(response);
};
