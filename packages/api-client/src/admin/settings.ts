import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';

import { requestMultipart } from '../client/request-multipart';

import type {
  CurrencySetting,
  CurrencySettingInput,
  ThemeSetting,
  ThemeSettingInput,
  TranslationSetting,
  TranslationSettingInput,
  BrandingSetting,
  BrandingSettingInput
} from './types';
import {
  parseCurrencySettingResponse,
  parseThemeSettingResponse,
  parseTranslationSettingResponse,
  parseBrandingSettingResponse
} from './validators';

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

export const getThemeSetting = async (): Promise<ThemeSetting> => {
  const response = await requestJson(
    {
      baseUrl: API_BASE_URL
    },
    '/settings/theme'
  );

  return parseThemeSettingResponse(response);
};

export const updateThemeSetting = async (
  input: ThemeSettingInput,
  token: string
): Promise<ThemeSetting> => {
  const response = await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    '/settings/theme',
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    }
  );

  return parseThemeSettingResponse(response);
};

export const getTranslationSetting = async (): Promise<TranslationSetting> => {
  const response = await requestJson(
    {
      baseUrl: API_BASE_URL
    },
    '/settings/translations'
  );

  return parseTranslationSettingResponse(response);
};

export const updateTranslationSetting = async (
  input: TranslationSettingInput,
  token: string
): Promise<TranslationSetting> => {
  const response = await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    '/settings/translations',
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    }
  );

  return parseTranslationSettingResponse(response);
};

export const getBrandingSetting = async (): Promise<BrandingSetting> => {
  const response = await requestJson(
    {
      baseUrl: API_BASE_URL
    },
    '/settings/branding'
  );

  return parseBrandingSettingResponse(response);
};

export const updateBrandingSetting = async (
  input: BrandingSettingInput,
  token: string
): Promise<BrandingSetting> => {
  const formData = new FormData();

  if (input.title !== undefined) {
    formData.append('title', input.title);
  }

  if (input.subtitle !== undefined) {
    formData.append('subtitle', input.subtitle);
  }

  if (input.image !== undefined) {
    formData.append('image', input.image);
  }

  const response = await requestMultipart('/settings/branding', 'PATCH', formData, token);

  return parseBrandingSettingResponse(response);
};
