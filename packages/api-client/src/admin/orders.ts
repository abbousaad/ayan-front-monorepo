import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';

export const confirmOrder = async (id: string, token: string): Promise<void> => {
  await requestJson(
    {
      baseUrl: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` }
    },
    `/orders/${id}/confirm`,
    { method: 'PATCH' }
  );
};
