import { ValidatedRequestSchema, ContainerTypes, ValidatedRequest } from 'express-joi-validation';

interface IValidatedRequestBodySchema<T> extends ValidatedRequestSchema {
    [ContainerTypes.Body]: T;
}

interface IValidatedRequestParamsSchema<T> extends ValidatedRequestSchema {
    [ContainerTypes.Params]: { [key in keyof T]: string };
}

interface IValidatedRequestQuerySchema<T> extends ValidatedRequestSchema {
    [ContainerTypes.Query]: T;
}

export type IValidatedReqBody<T> = ValidatedRequest<IValidatedRequestBodySchema<T>>;
export type IValidatedReqParams<T> = ValidatedRequest<IValidatedRequestParamsSchema<T>>;
export type IValidatedReqQuery<T> = ValidatedRequest<IValidatedRequestQuerySchema<T>>;
