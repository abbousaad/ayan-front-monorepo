import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';

import type { Coupon, CouponInput, UpdateCouponInput } from './types';
import { parseCouponResponse, parseCouponsResponse } from './validators';

export const listCoupons = async (token: string): Promise<Coupon[]> => {
  const response = await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    '/coupons'
  );

  return parseCouponsResponse(response);
};

export const createCoupon = async (input: CouponInput, token: string): Promise<Coupon> => {
  const response = await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    '/coupons',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    }
  );

  return parseCouponResponse(response);
};

export const updateCoupon = async (
  id: string,
  input: UpdateCouponInput,
  token: string
): Promise<Coupon> => {
  const response = await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    `/coupons/${id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    }
  );

  return parseCouponResponse(response);
};

export const deleteCoupon = async (id: string, token: string): Promise<void> => {
  await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    `/coupons/${id}`,
    { method: 'DELETE' }
  );
};
