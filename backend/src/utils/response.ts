export const success = (data: any) => ({ success: true, data, message: "Operation successful" });
export const failure = (message: string, code = 400) => ({ success: false, message, code });
export const notFound = (message: string = "Resource not found") => ({ success: false, message, code: 404 });
export const badRequest = (message: string = "Bad request") => ({ success: false, message, code: 400 });
export const unauthorized = (message: string = "Unauthorized") => ({ success: false, message, code: 401 });
export const forbidden = (message: string = "Forbidden") => ({ success: false, message, code: 403 });
export const internalServerError = (message: string = "Internal server error") => ({ success: false, message, code: 500 });
