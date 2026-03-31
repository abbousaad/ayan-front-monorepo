export const createApiUrl = (baseUrl, path, queryString) => {
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (!queryString) {
        return `${normalizedBaseUrl}${normalizedPath}`;
    }
    return `${normalizedBaseUrl}${normalizedPath}?${queryString}`;
};
//# sourceMappingURL=create-api-url.js.map