import { IValidationError } from '../errors/ierror-message';
import { IErrorMessage } from '../validation/ivalidation-error';

export interface IResponse<T = null> {
    success: boolean;
    result: T,
    errorList: IResponseError[]
}

export type IResponseError =  IErrorMessage | IValidationError;
