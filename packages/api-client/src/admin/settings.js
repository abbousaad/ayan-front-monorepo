import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';
import { parseCurrencySettingResponse } from './validators';
export const getCurrencySetting = async (token) => {
    const response = await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, '/settings/currency');
    return parseCurrencySettingResponse(response);
};
export const updateCurrencySetting = async (input, token) => {
    const response = await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, '/settings/currency', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    });
    return parseCurrencySettingResponse(response);
};
