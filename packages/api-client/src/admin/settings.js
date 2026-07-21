import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';
import { parseCurrencySettingResponse, parseThemeSettingResponse } from './validators';
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
export const getThemeSetting = async () => {
    const response = await requestJson({
        baseUrl: API_BASE_URL
    }, '/settings/theme');
    return parseThemeSettingResponse(response);
};
export const updateThemeSetting = async (input, token) => {
    const response = await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, '/settings/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    });
    return parseThemeSettingResponse(response);
};
