import { ERROR_MESSAGES } from './constants';

export class AppError extends Error {
    constructor(message, statusCode = 500, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(errors) {
        super('Validation failed', 400, errors);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = ERROR_MESSAGES.UNAUTHORIZED) {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = ERROR_MESSAGES.FORBIDDEN) {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message = ERROR_MESSAGES.NOT_FOUND) {
        super(message, 404);
    }
}

export const handleError = (error) => {
    if (error instanceof AppError) {
        return {
            message: error.message,
            statusCode: error.statusCode,
            errors: error.errors,
        };
    }

    return {
        message: ERROR_MESSAGES.SERVER_ERROR,
        statusCode: 500,
        errors: null,
    };
};

export const logError = (error, context = '') => {
    const timestamp = new Date().toISOString();
    const errorInfo = {
        timestamp,
        context,
        message: error.message,
        stack: error.stack,
        ...(error instanceof AppError && { statusCode: error.statusCode, errors: error.errors }),
    };

    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', errorInfo);
    }

    return errorInfo;
};
