import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';

import { parseStoreResponse } from './validators';

export const getStoreById = async (storeId: string) => {
  const response = await requestJson({ baseUrl: API_BASE_URL }, `/stores/${storeId}`);

  return parseStoreResponse(response);
};
