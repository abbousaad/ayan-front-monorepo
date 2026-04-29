export class ApiClientError extends Error {
    code;
    details;
    status;
    constructor({ code, message, details, status }) {
        super(message);
        this.name = 'ApiClientError';
        this.code = code;
        this.details = details;
        this.status = status;
    }
}
