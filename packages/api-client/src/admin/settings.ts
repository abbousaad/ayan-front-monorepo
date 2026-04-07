import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';

import type { CurrencySetting, CurrencySettingInput } from './types';
import { parseCurrencySettingResponse } from './validators';

export const getCurrencySetting = async (token: string): Promise<CurrencySetting> => {
  const response = await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    '/settings/currency'
  );

  return parseCurrencySettingResponse(response);
};

export const updateCurrencySetting = async (
  input: CurrencySettingInput,
  token: string
): Promise<CurrencySetting> => {
  const response = await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    '/settings/currency',
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    }
  );

  return parseCurrencySettingResponse(response);
};
