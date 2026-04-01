import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';

import type { AdminLoginResponse, ChangePasswordRequest } from './types';
import { parseAdminLoginResponse } from './validators';

export const login = async (username: string, password: string): Promise<AdminLoginResponse> => {
  const response = await requestJson(
    { baseUrl: API_BASE_URL },
    '/auth/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }
  );

  return parseAdminLoginResponse(response);
};

export const changePassword = async (
  input: ChangePasswordRequest,
  token: string
): Promise<void> => {
  await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    '/auth/change-password',
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: input.currentPassword, newPassword: input.newPassword })
    }
  );
};
