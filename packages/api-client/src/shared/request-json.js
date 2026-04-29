import { ApiClientError } from './api-client-error';
import { createApiUrl } from './create-api-url';
const DEFAULT_ERROR_CODE = 'API_REQUEST_FAILED';
const DEFAULT_ERROR_MESSAGE = 'The API request failed.';
const parseErrorPayload = async (response) => {
    try {
        return (await response.json());
    }
    catch {
        return null;
    }
};
export const requestJson = async (config, path, init, queryString) => {
    const fetchImplementation = config.fetch ?? fetch;
    if (typeof fetchImplementation !== 'function') {
        throw new ApiClientError({
            code: 'FETCH_UNAVAILABLE',
            message: 'A fetch implementation is required to perform API requests.'
        });
    }
    const response = await fetchImplementation(createApiUrl(config.baseUrl, path, queryString), {
        ...init,
        headers: {
            Accept: 'application/json',
            ...config.headers,
            ...init?.headers
        }
    });
    if (!response.ok) {
        const errorPayload = await parseErrorPayload(response);
        throw new ApiClientError({
            code: errorPayload?.error?.code ?? DEFAULT_ERROR_CODE,
            message: errorPayload?.error?.message ?? DEFAULT_ERROR_MESSAGE,
            details: errorPayload?.error?.details,
            status: response.status
        });
    }
    return response.json();
};
