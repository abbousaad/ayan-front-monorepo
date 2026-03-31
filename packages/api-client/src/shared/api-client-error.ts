export type ApiClientErrorDetails = {
  code: string;
  message: string;
  details?: string;
  status?: number;
};

export class ApiClientError extends Error {
  readonly code: string;
  readonly details?: string;
  readonly status?: number;

  constructor({ code, message, details, status }: ApiClientErrorDetails) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.details = details;
    this.status = status;
  }
}
