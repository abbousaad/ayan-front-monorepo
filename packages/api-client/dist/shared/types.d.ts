export type ApiClientConfig = {
    baseUrl: string;
    fetch?: typeof fetch;
    headers?: Record<string, string>;
};
export type ApiErrorPayload = {
    error?: {
        code?: string;
        message?: string;
        details?: string;
    };
};
//# sourceMappingURL=types.d.ts.map