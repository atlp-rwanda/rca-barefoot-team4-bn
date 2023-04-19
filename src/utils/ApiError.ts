export class ApiError extends Error {
    success: boolean
    statusCode: number
    isOperational
    constructor(
        success: boolean,
        statusCode: number,
        message: string,
        isOperational = true,
        stack = ''
    ) {
        super(message)
        this.success = success
        this.statusCode = statusCode
        this.isOperational = isOperational
        if (stack) this.stack = stack
        else Error.captureStackTrace(this, this.constructor)
    }
}
