"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
class ErrorMiddleware {
    handle(error, req, res, next) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
exports.ErrorMiddleware = ErrorMiddleware;
