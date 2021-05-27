import { IErrorMessage } from '../validation/ivalidation-error';

export interface IValidationError extends IErrorMessage {
    path: Array<string | number>,
    type: string
}
