import express, { Request, Response, NextFunction } from 'express';
import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { IResponse } from '../shared/response/iresponse';
import { failResponseFactory } from '../shared/response/responseFactory';
import { validationResultGuard } from '../shared/validation/validation-error-guard';
import { validationErrorMapper } from '../shared/validation/validation-error-mapper';
import { PgUserRepository } from './repositories/pg-user-repository';
import { UserController } from './user-controller';
import { UserMapper } from './user-mapper';
import { UserService } from './user-service';
import { createUserValidator, userIdParamValidator, updateUserValidator, queryUserValidator, addToGroupsValidator } from './user-validator';

export const userRouter = express.Router();

const userMapper = new UserMapper();
const userRepository = new PgUserRepository();
const userService = new UserService(userMapper, userRepository);
const userController = new UserController(userService);

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

userRouter
    .route('/:userId/groups')
    .put(
        userIdParamValidator,
        addToGroupsValidator,
        userController.addUserToGroups.bind(userController)
    );

userRouter.use((error: Error, _: Request, res: Response<IResponse>, next: NextFunction) => {
    if (error instanceof NullReferenceException) {
        return res.status(404).json(failResponseFactory([{ message: error.message }]));
    }
    if (validationResultGuard(error) && error.error) {
        return res.status(400).json(failResponseFactory(validationErrorMapper(error.error)));
    }
    return next(error);
});
