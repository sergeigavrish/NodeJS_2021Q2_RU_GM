import { NextFunction, Response } from 'express';
import { IValidatedReqBody, IValidatedReqParams, IValidatedReqQuery } from '../shared/interfaces/ivalidated-request';
import { IUserDto } from './interfaces/iuser-dto';
import { IUserId } from './interfaces/iuser-id';
import { IUserQuery } from './interfaces/iuser-query';
import { UserService, userService } from './user-service';

export class UserController {
    private static instance: UserController;

    private constructor(
        private userService: UserService
    ) { }

    static getInstance(userService: UserService): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController(userService);
        }
        return UserController.instance;
    }

    async getUserById(req: IValidatedReqParams<IUserId>, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;
            res.send(await this.userService.getUserById(userId));
        } catch (error) {
            next(error);
        }
    }

    async getUsersByLogin(req: IValidatedReqQuery<IUserQuery>, res: Response, next: NextFunction) {
        try {
            const login = req.query.login;
            const limit = req.query.limit;
            res.send(await this.userService.getUsersByLogin(login, limit));
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: IValidatedReqBody<IUserDto>, res: Response, next: NextFunction) {
        try {
            const userDto = req.body;
            res.send(await this.userService.createUser(userDto));
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: IValidatedReqBody<Required<IUserDto>>, res: Response, next: NextFunction) {
        try {
            const userDto = req.body;
            res.send(await this.userService.updateUser(userDto));
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: IValidatedReqParams<IUserId>, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;
            res.send(await this.userService.deleteUser(userId));
        } catch (error) {
            next(error);
        }
    }
}

export const userController = UserController.getInstance(userService);
