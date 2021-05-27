import { ValidationError } from 'joi';
import { IValidationError } from '../errors/ierror-message';

export const validationErrorMapper = (error: ValidationError): IValidationError[] => {
    return error.details.map(e => (
        { message: e.message, path: e.path, type: e.type }
    ));
}