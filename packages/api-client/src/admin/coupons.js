import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';
import { parseCouponResponse, parseCouponsResponse } from './validators';
export const listCoupons = async (token) => {
    const response = await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, '/coupons');
    return parseCouponsResponse(response);
};
export const createCoupon = async (input, token) => {
    const response = await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, '/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    });
    return parseCouponResponse(response);
};
export const updateCoupon = async (id, input, token) => {
    const response = await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, `/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    });
    return parseCouponResponse(response);
};
export const deleteCoupon = async (id, token) => {
    await requestJson({
        baseUrl: API_BASE_URL,
        headers: { Authorization: `Bearer ${token}` }
    }, `/coupons/${id}`, { method: 'DELETE' });
};
