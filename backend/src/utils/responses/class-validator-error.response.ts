import { ValidationError } from 'class-validator';

export class ClassValidatorErrorResponse {
  static format(errors: ValidationError[]): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};

    for (const error of errors) {
      this.processError(error, formatted);
    }

    return formatted;
  }

  private static processError(error: ValidationError, formatted: Record<string, string[]>, parentPath = '') {
    const path = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints) {
      formatted[path] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      for (const child of error.children) {
        this.processError(child, formatted, path);
      }
    }
  }
}