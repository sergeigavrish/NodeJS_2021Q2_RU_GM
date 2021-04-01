import express, { Request, Response, NextFunction } from 'express';
import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { userController } from './user-controller';
import { createUserValidator, userIdParamValidator, updateUserValidator, userQueryValidator } from './user-validator';

export const userRouter = express.Router();

userRouter
    .route('/')
    .get(
        userQueryValidator,
        userController.getUsersByLogin.bind(userController)
    )
    .post(
        createUserValidator,
        userController.createUser.bind(userController)
    )
    .put(
        updateUserValidator,
        userController.updateUser.bind(userController)
    );

userRouter
    .route('/:userId')
    .get(
        userIdParamValidator,
        userController.getUserById.bind(userController)
    )
    .delete(
        userIdParamValidator,
        userController.deleteUser.bind(userController)
    );

userRouter.use((error: Error, _: Request, res: Response, next: NextFunction) => {
    if (error instanceof NullReferenceException) {
        res.sendStatus(404);
        return;
    }
    next(error);
});
