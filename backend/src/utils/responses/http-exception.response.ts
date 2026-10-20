import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpExceptionResponse extends HttpException {
  constructor(
    message: string | object,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode?: string,
  ) {
    const response = {
      success: false,
      message: typeof message === 'string' ? message : 'Error interno del servidor',
      errors: typeof message === 'object' ? message : undefined,
      errorCode,
      timestamp: new Date().toISOString(),
    };

    super(response, statusCode);
  }
}

export class BadRequestExceptionResponse extends HttpExceptionResponse {
  constructor(message: string | object, errorCode?: string) {
    super(message, HttpStatus.BAD_REQUEST, errorCode);
  }
}

export class UnauthorizedExceptionResponse extends HttpExceptionResponse {
  constructor(message: string | object = 'No autorizado', errorCode?: string) {
    super(message, HttpStatus.UNAUTHORIZED, errorCode);
  }
}

export class ForbiddenExceptionResponse extends HttpExceptionResponse {
  constructor(message: string | object = 'Prohibido', errorCode?: string) {
    super(message, HttpStatus.FORBIDDEN, errorCode);
  }
}

export class NotFoundExceptionResponse extends HttpExceptionResponse {
  constructor(message: string | object = 'Recurso no encontrado', errorCode?: string) {
    super(message, HttpStatus.NOT_FOUND, errorCode);
  }
}

export class ConflictExceptionResponse extends HttpExceptionResponse {
  constructor(message: string | object = 'Conflicto de recursos', errorCode?: string) {
    super(message, HttpStatus.CONFLICT, errorCode);
  }
}