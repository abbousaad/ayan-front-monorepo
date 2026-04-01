import { ApiClientError } from '../shared/api-client-error';
import { createApiUrl } from '../shared/create-api-url';
import type { ApiErrorPayload } from '../shared/types';
import { API_BASE_URL } from './config';

const DEFAULT_ERROR_CODE = 'API_REQUEST_FAILED';
const DEFAULT_ERROR_MESSAGE = 'The API request failed.';

const parseErrorPayload = async (response: Response): Promise<ApiErrorPayload | null> => {
  try {
    return (await response.json()) as ApiErrorPayload;
  } catch {
    return null;
  }
};

export const requestMultipart = async (
  path: string,
  method: string,
  formData: FormData,
  token: string
): Promise<unknown> => {
  const response = await fetch(createApiUrl(API_BASE_URL, path), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type is intentionally omitted: the browser sets the
      // multipart/form-data boundary automatically.
    },
    body: formData
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

  return response.json() as Promise<unknown>;
};
