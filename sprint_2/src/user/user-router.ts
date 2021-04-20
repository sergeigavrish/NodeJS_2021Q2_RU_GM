import express, { Request, Response, NextFunction } from 'express';
import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { IResponse } from '../shared/response/iresponse';
import { failResponseFactory } from '../shared/response/responseFactory';
import { validationResultGuard } from '../shared/validation/validation-error-guard';
import { validationErrorMapper } from '../shared/validation/validation-error-mapper';
import { userController } from './user-controller';
import { createUserValidator, userIdParamValidator, updateUserValidator, queryUserValidator } from './user-validator';

export const userRouter = express.Router();

userRouter
    .route('/')
    .get(
        queryUserValidator,
        userController.getUsers.bind(userController)
    )
    .post(
        createUserValidator,
        userController.createUser.bind(userController)
    );

userRouter
    .route('/:userId')
    .get(
        userIdParamValidator,
        userController.getUserById.bind(userController)
    )
    .put(
        userIdParamValidator,
        updateUserValidator,
        userController.updateUser.bind(userController)
    )
    .delete(
        userIdParamValidator,
        userController.deleteUser.bind(userController)
    );

userRouter.use((error: Error, _: Request, res: Response<IResponse>, next: NextFunction) => {
    if (error instanceof NullReferenceException) {
        res.status(404).json(failResponseFactory([{ message: error.message }]));
        return;
    }
    if (validationResultGuard(error) && error.error) {
        res.status(400).json(failResponseFactory(validationErrorMapper(error.error)));
        return;
    }
    next(error);
});
