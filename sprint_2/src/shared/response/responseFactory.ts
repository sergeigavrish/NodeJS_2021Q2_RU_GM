import { IResponse, IResponseError } from './iresponse';

export const successResponseFactory = <T>(result: T): IResponse<T> => {
    return {
        success: true,
        result,
        errorList: []
    };
}

export const failResponseFactory = (errorList: IResponseError[]): IResponse => {
    return {
        success: false,
        result: null,
        errorList
    };
}
