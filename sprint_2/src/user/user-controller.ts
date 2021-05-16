import { NextFunction, Response } from 'express';
import { IValidatedReqBody, IValidatedReqParams, IValidatedReqQuery } from '../shared/request/ivalidated-request';
import { IResponse } from '../shared/response/iresponse';
import { successResponseFactory } from '../shared/response/responseFactory';
import { IResponseUserDto } from './interfaces/iresponse-user-dto';
import { IUserDto } from './interfaces/iuser-dto';
import { IUserId } from './interfaces/iuser-id';
import { IUserQuery } from './interfaces/iuser-query';
import { UserService, userService } from './user-service';

export class UserController {
    private static instance: UserController;

    private constructor(
        private service: UserService
    ) { }

    static getInstance(userService: UserService): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController(userService);
        }
        return UserController.instance;
    }

    async getUsers(req: IValidatedReqQuery<IUserQuery>, res: Response<IResponse<IResponseUserDto[]>>, next: NextFunction) {
        try {
            const users = await this.service.getUsers(req.query);
            const response = successResponseFactory(users);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: IValidatedReqParams<IUserId>, res: Response<IResponse<IResponseUserDto>>, next: NextFunction) {
        try {
            const userId = req.params.userId;
            const user = await this.service.getUserById(userId);
            const response = successResponseFactory(user);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: IValidatedReqBody<IUserDto>, res: Response<IResponse<IResponseUserDto>>, next: NextFunction) {
        try {
            const userDto = req.body;
            const user = await this.service.createUser(userDto);
            const response = successResponseFactory(user);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: IValidatedReqBody<IUserDto>, res: Response<IResponse<IResponseUserDto>>, next: NextFunction) {
        try {
            const userId: string = req.params.userId;
            const userDto = req.body;
            const user = await this.service.updateUser(userId, userDto);
            const response = successResponseFactory(user);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: IValidatedReqParams<IUserId>, res: Response<IResponse<boolean>>, next: NextFunction) {
        try {
            const userId = req.params.userId;
            const isDeleted = await this.service.deleteUser(userId);
            const response = successResponseFactory(isDeleted);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async addUserToGroups(req: IValidatedReqBody<{ groupIdList: string[] }>, res: Response<IResponse<boolean>>, next: NextFunction) {
        try {
            const userId: string = req.params.userId;
            const groupIdList = req.body.groupIdList;
            const result = await this.service.addUserToGroups(userId, groupIdList);
            const response = successResponseFactory(result);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }
}

export const userController = UserController.getInstance(userService);
