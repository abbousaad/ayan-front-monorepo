import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';

import { parseProductsResponse } from '../products/validators';

export const getStoreProducts = async (storeId: string) => {
  const response = await requestJson({ baseUrl: API_BASE_URL }, `/stores/${storeId}/products`);

  return parseProductsResponse(response);
};
