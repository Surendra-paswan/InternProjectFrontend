import { ZodError } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function formatZodErrors(error: ZodError): ValidationError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

export function getFieldError(errors: ValidationError[], fieldPath: string): string | null {
  const error = errors.find((err) => err.field === fieldPath);
  return error ? error.message : null;
}

export function hasFieldError(errors: ValidationError[], fieldPath: string): boolean {
  return errors.some((err) => err.field === fieldPath);
}
// Helper to get error for a field in current step context
export function getStepFieldError(errors: ValidationError[], stepKey: string, fieldPath: string): string | null {
  // Try with step prefix (e.g., "personal.fullName")
  const fullPath = `${stepKey}.${fieldPath}`;
  const error = errors.find((err) => err.field === fullPath || err.field === fieldPath);
  return error ? error.message : null;
}

export function hasStepFieldError(errors: ValidationError[], stepKey: string, fieldPath: string): boolean {
  const fullPath = `${stepKey}.${fieldPath}`;
  return errors.some((err) => err.field === fullPath || err.field === fieldPath);
}