import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';
import { parsePricingConfigResponse } from './validators';
export const getPricingConfig = async (token) => {
    const response = await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, '/orders/pricing-config');
    return parsePricingConfigResponse(response);
};
export const updatePricingConfig = async (input, token) => {
    const response = await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, '/orders/pricing-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    });
    return parsePricingConfigResponse(response);
};
