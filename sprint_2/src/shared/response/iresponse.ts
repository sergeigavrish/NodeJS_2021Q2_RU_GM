export interface IResponse<T> {
    success: boolean;
    result: T,
    errorList: IResponseError[]
}

export interface IResponseError {
    message: string;
}
