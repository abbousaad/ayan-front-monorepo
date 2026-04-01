import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';

import type { CreatePublicOrderRequest, PublicOrder } from './types';
import { parseCreatePublicOrderResponse } from './validators';

export const createPublicOrder = async (body: CreatePublicOrderRequest): Promise<PublicOrder> => {
  const response = await requestJson(
    { baseUrl: API_BASE_URL },
    '/public/orders',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  );

  return parseCreatePublicOrderResponse(response).data;
};
