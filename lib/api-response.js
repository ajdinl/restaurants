import { NextResponse } from 'next/server';
import { HTTP_STATUS } from './constants';

export class ApiResponse {
    static success(data, status = HTTP_STATUS.OK) {
        return NextResponse.json({ success: true, data }, { status });
    }

    static created(data) {
        return NextResponse.json({ success: true, data }, { status: HTTP_STATUS.CREATED });
    }

    static error(message, status = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
        const response = { success: false, error: message };
        if (errors) {
            response.errors = errors;
        }
        return NextResponse.json(response, { status });
    }

    static badRequest(message, errors = null) {
        return this.error(message, HTTP_STATUS.BAD_REQUEST, errors);
    }

    static unauthorized(message = 'Unauthorized') {
        return this.error(message, HTTP_STATUS.UNAUTHORIZED);
    }

    static forbidden(message = 'Forbidden') {
        return this.error(message, HTTP_STATUS.FORBIDDEN);
    }

    static notFound(message = 'Resource not found') {
        return this.error(message, HTTP_STATUS.NOT_FOUND);
    }
}
