import { NextFunction, Response } from 'express';
import { IValidatedReqBody, IValidatedReqParams, IValidatedReqQuery } from '../shared/request/ivalidated-request';
import { IResponse } from '../shared/response/iresponse';
import { successResponseFactory } from '../shared/response/responseFactory';
import { ICreateUserDto, IResponseUserDto, IUpdateUserDto } from './interfaces/iuser-dto';
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

    async getUsers(req: IValidatedReqQuery<Partial<IUserQuery>>, res: Response<IResponse<IResponseUserDto[]>>, next: NextFunction) {
        try {
            res.send(successResponseFactory(await this.userService.getUsers(req.query)));
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: IValidatedReqParams<IUserId>, res: Response<IResponse<IResponseUserDto>>, next: NextFunction) {
        try {
            const userId = req.params.userId;
            res.json(successResponseFactory(await this.userService.getUserById(userId)));
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: IValidatedReqBody<ICreateUserDto>, res: Response<IResponse<IResponseUserDto>>, next: NextFunction) {
        try {
            const userDto = req.body;
            res.send(successResponseFactory(await this.userService.createUser(userDto)));
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: IValidatedReqBody<IUpdateUserDto>, res: Response<IResponse<IResponseUserDto>>, next: NextFunction) {
        try {
            const userDto = req.body;
            res.send(successResponseFactory(await this.userService.updateUser(userDto)));
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: IValidatedReqParams<IUserId>, res: Response<IResponse<boolean>>, next: NextFunction) {
        try {
            const userId = req.params.userId;
            res.send(successResponseFactory(await this.userService.deleteUser(userId)));
        } catch (error) {
            next(error);
        }
    }
}

export const userController = UserController.getInstance(userService);
