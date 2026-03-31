import { API_BASE_URL } from '../client/config';
import { requestJson } from '../shared/request-json';

import { parseProductsResponse } from './validators';
import type { ProductsQuery } from './types';

const createProductsSearchParams = (query?: ProductsQuery) => {
  const searchParams: string[] = [];

  if (query?.storeId) {
    searchParams.push(`storeId=${encodeURIComponent(query.storeId)}`);
  }

  return searchParams.join('&');
};

export const getProducts = async (query?: ProductsQuery) => {
  const response = await requestJson({ baseUrl: API_BASE_URL }, '/products', undefined, createProductsSearchParams(query));

  return parseProductsResponse(response);
};
