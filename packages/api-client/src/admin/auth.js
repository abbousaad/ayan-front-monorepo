import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';
import { parseAdminLoginResponse } from './validators';
export const login = async (username, password) => {
    const response = await requestJson({ baseUrl: API_BASE_URL }, '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return parseAdminLoginResponse(response);
};
export const changePassword = async (input, token) => {
    await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, '/auth/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: input.currentPassword, newPassword: input.newPassword })
    });
};
