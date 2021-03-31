import express, { NextFunction, Request, Response } from 'express';
import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { IUserDto } from './interfaces/iuser-dto';
import { userService } from './user-service';

enum UserRoutes {
    userById = '/:userId',
    userByLogin = '',
    createdUser = '/',
    updateUser = '/',
    deleteUser = '/:userId',
}

export const userRouter = express.Router();

userRouter.get(
    UserRoutes.userById,
    async (req, res, next) => {
        try {
            const userId: string = <string>req.params.userId;
            res.send(await userService.getUserById(userId));
        } catch (error) {
            next(error);
        }
    }
);

userRouter.get(
    UserRoutes.userByLogin,
    async (req, res, next) => {
        try {
            const login = <string>req.query.login;
            const limit = Number(req.query.limit);
            res.send(await userService.getUsersByLogin(login, limit));
        } catch (error) {
            next(error);
        }
    }
);

userRouter.post(
    UserRoutes.createdUser,
    async (req, res, next) => {
        try {
            const userDto: IUserDto = req.body;
            res.send(await userService.createUser(userDto));
        } catch (error) {
            next(error);
        }
    }
);

userRouter.put(
    UserRoutes.updateUser,
    async (req, res, next) => {
        try {
            const userDto: Required<IUserDto> = req.body;
            res.send(await userService.updateUser(userDto));
        } catch (error) {
            next(error);
        }
    }
);

userRouter.delete(
    UserRoutes.deleteUser,
    async (req, res, next) => {
        try {
            const userId: string = <string>req.params.userId;
            res.send(await userService.deleteUser(userId));
        } catch (error) {
            next(error);
        }
    }
);

userRouter.use((error: Error, _: Request, res: Response, next: NextFunction) => {
    if (error instanceof NullReferenceException) {
        res.sendStatus(404);
        return;
    }
    next(error);
});
