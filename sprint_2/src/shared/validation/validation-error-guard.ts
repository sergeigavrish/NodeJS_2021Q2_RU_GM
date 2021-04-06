import { ValidationError, ValidationResult } from 'joi';

export const validationResultGuard = (value: unknown): value is ValidationResult => {
    const data = value as ValidationResult;
    return !!data.error && data.error instanceof ValidationError;
}
