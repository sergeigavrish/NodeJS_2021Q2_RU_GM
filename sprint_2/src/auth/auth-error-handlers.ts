import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { logger } from '../logger/bootstrap-logger';
import { AuthenticationException } from '../shared/errors/authentication-exception';
import { AuthorizationException } from '../shared/errors/authorization-exception';
import { IResponse } from '../shared/response/iresponse';
import { failResponseFactory } from '../shared/response/responseFactory';

const LABEL = 'AUTH';

export const authenticationErrorHandler = (err: Error, _: Request, res: Response<IResponse>, next: NextFunction) => {
    if (err instanceof AuthenticationException) {
        logger.error({ message: err.message, label: LABEL });
        const response = failResponseFactory([{ message: err.message }]);
        return res.status(401).json(response);
    }
    return next(err);
}

export const authorizationErrorHandler = (err: Error, _: Request, res: Response<IResponse>, next: NextFunction): any => {
    if (err instanceof AuthorizationException || err instanceof JsonWebTokenError) {
        logger.error({ message: err.message, label: LABEL });
        const response = failResponseFactory([{ message: err.message }]);
        return res.status(401).json(response);
    }
    return next(err);
};