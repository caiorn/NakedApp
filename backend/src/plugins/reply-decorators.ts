export type SuccessReply = typeof success;
export type FailReply = typeof fail;

export function success(
    this: any,
    statusCode: number,
    {
        data = null,
        message = null,
        meta = {}
    }: {
        data?: any;
        message?: string | null;
        meta?: object;
    }
) {
    const response: {
        success: boolean;
        status: number;
        message?: string | null;
        data?: any;
        meta?: object;
        path?: string;
        timestamp?: string;
    } = {
        success: true,
        status: statusCode || 200,
        message: message || undefined,
        data: data ?? undefined
    };

    for (const _ in meta) {
        response.meta = meta;
        break;
    }

    response.path = this.request.raw.url;
    response.timestamp = new Date().toISOString();
    this.code(statusCode || 200).send(response);
}

export function fail(this: any, statusCode: number, { message, error, issues, origin }: { message?: string; error?: string; issues?: any; origin?: string }) {
    const response: {
        success: boolean;
        status: number;
        message: string;
        error: string;
        issues?: any;
        origin?: string;
        path?: string;
        timestamp?: string;
    } = {
        success: false,
        status: statusCode || 500,
        message: message || 'An error occurred',
        error: error || 'InternalServerError',
        issues: issues || undefined,
        origin: origin || undefined
    };

    response.path = this.request.raw.url;
    response.timestamp = new Date().toISOString();

    this.code(statusCode || 500).send(response);
}