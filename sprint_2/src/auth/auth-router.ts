import express, { NextFunction, Request, Response } from 'express';
import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { IResponse } from '../shared/response/iresponse';
import { failResponseFactory } from '../shared/response/responseFactory';
import { PgUserRepository } from '../user/repositories/pg-user-repository';
import { AuthController } from './auth-controller';
import { AuthService } from './auth-service';

export const authRouter = express.Router();
const pgUserRepository = new PgUserRepository();
const authService = new AuthService(pgUserRepository);
const authController = new AuthController(authService);

authRouter
    .route('/login')
    .post(
        authController.login.bind(authController)
    );

authRouter.use((error: Error, _: Request, res: Response<IResponse>, next: NextFunction) => {
    if (error instanceof NullReferenceException) {
        return res.status(404).json(failResponseFactory([{ message: error.message }]));
    }
    return next(error);
});