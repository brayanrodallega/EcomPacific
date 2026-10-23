import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function flattenValidationErrors(
  errors: ValidationError[],
  parent = '',
): Record<string, string[]> {
  return errors.reduce<Record<string, string[]>>((acc, error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const messages = error.constraints ? Object.values(error.constraints) : [];

    if (messages.length > 0) {
      acc[field] = messages;
    }

    if (error.children && error.children.length > 0) {
      Object.assign(acc, flattenValidationErrors(error.children, field));
    }

    return acc;
  }, {});
}

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) =>
      new BadRequestException({
        message: 'Datos de entrada inválidos',
        errors: flattenValidationErrors(errors),
      }),
  });
}
