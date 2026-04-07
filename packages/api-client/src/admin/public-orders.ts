import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';

import type { PublicOrderStatus } from './types';

export const listPublicOrders = async (
  token: string,
  status?: PublicOrderStatus
): Promise<unknown> => {
  const queryString = status ? `status=${encodeURIComponent(status)}` : undefined;

  return requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    '/public-orders',
    undefined,
    queryString
  );
};

export const confirmPublicOrder = async (id: string, token: string): Promise<void> => {
  await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    `/public-orders/${id}/confirm`,
    { method: 'PATCH' }
  );
};

export const acceptPublicOrderDelivery = async (id: string, token: string): Promise<void> => {
  await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    `/public-orders/${id}/accept-delivery`,
    { method: 'PATCH' }
  );
};

export const markPublicOrderPaid = async (id: string, token: string): Promise<void> => {
  await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    `/public-orders/${id}/mark-paid`,
    { method: 'PATCH' }
  );
};
