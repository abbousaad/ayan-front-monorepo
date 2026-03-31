export type ApiClientErrorDetails = {
    code: string;
    message: string;
    details?: string;
    status?: number;
};
export declare class ApiClientError extends Error {
    readonly code: string;
    readonly details?: string;
    readonly status?: number;
    constructor({ code, message, details, status }: ApiClientErrorDetails);
}
//# sourceMappingURL=api-client-error.d.ts.map