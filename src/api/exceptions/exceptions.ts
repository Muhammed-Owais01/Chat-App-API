export enum ExceptionType {
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    USERNAME_CONFLICT = 'USERNAME_CONFLICT',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    MESSAGE_NOT_FOUND = 'MESSAGE_NOT_FOUND',
    INVALID_ID = 'INVALID_ID',
    INVALID_REQUEST = 'INVALID_REQUEST',
    AUTH_FAILURE = 'AUTH_FAILURE',
    INVALID_TOKEN = 'INVALID_TOKEN',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FRIENDS_NOT_FOUND = 'FRIENDS_NOT_FOUND',
}

export const Exceptions: Record<ExceptionType, { status: number, message: string }> = {
    [ExceptionType.INTERNAL_ERROR]: { status: 500, message: 'An unexpected error occurred' },
    [ExceptionType.USERNAME_CONFLICT]: { status: 409, message: 'User already exists' },
    [ExceptionType.USER_NOT_FOUND]: { status: 404, message: 'User does not exist'},
    [ExceptionType.MESSAGE_NOT_FOUND]: { status: 404, message: 'Message does not exist'},
    [ExceptionType.INVALID_ID]: { status: 400, message: 'Id is invalid'},
    [ExceptionType.INVALID_REQUEST]: { status: 400, message: 'Invalid request'},
    [ExceptionType.AUTH_FAILURE]: { status: 401, message: 'Authorization failed'},
    [ExceptionType.INVALID_TOKEN]: { status: 401, message: 'Authorization Failed: Token not provided'},
    [ExceptionType.UNAUTHORIZED]: { status: 403, message: 'Unauthorized'},
    [ExceptionType.FRIENDS_NOT_FOUND]: { status: 404, message: 'Friends do not exist'},
}