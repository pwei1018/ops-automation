"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(code, message) {
        super(`Error code: ${code}, message: ${message}`);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=api_error.js.map