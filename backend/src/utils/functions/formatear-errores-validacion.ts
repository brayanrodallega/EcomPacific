import { ValidationError } from 'class-validator';

export function formatearErroresValidacion(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    messages.push(...procesarError(error));
  }

  return messages;
}

function procesarError(error: ValidationError, parentPath = ''): string[] {
  const messages: string[] = [];
  const path = parentPath ? `${parentPath}.${error.property}` : error.property;

  if (error.constraints) {
    for (const [, message] of Object.entries(error.constraints)) {
      messages.push(`${path}: ${message}`);
    }
  }

  if (error.children && error.children.length > 0) {
    for (const child of error.children) {
      messages.push(...procesarError(child, path));
    }
  }

  return messages;
}