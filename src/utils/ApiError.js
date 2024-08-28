class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        statck = ""
    ) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors

        // ------------- If get error see If condition video: 10------------
        if (statck) {
            this.stack = statck;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError}