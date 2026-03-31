export const createApiUrl = (baseUrl: string, path: string, queryString?: string) => {
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!queryString) {
    return `${normalizedBaseUrl}${normalizedPath}`;
  }

  return `${normalizedBaseUrl}${normalizedPath}?${queryString}`;
};
