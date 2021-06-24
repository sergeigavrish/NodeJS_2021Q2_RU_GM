import { NextFunction, Response } from 'express';
import { v4 } from 'uuid';
import { CustomException } from '../shared/errors/custom-exception';
import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { successResponseFactory } from '../shared/response/responseFactory';
import { IResponseUserDto } from './interfaces/iresponse-user-dto';
import { IUserDto } from './interfaces/iuser-dto';
import { IUserQuery } from './interfaces/iuser-query';
import { PgUserRepository } from './repositories/pg-user-repository';
import { UserController } from './user-controller';
import { UserMapper } from './user-mapper';
import { UserService } from './user-service';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;
    let mapper: UserMapper;
    let repository: PgUserRepository;

    let res: Response;
    let next: NextFunction;


    beforeEach(() => {
        mapper = new UserMapper();
        repository = new PgUserRepository();
        service = new UserService(mapper, repository);
        controller = new UserController(service);
        res = {
            json: jest.fn()
        } as any as Response;
        next = jest.fn();
    });

    describe('getUsers', () => {
        let userQuery: IUserQuery;
        let mockRequest: any;

        beforeAll(() => {
            userQuery = { login: 'mockLogin', limit: 1 };
            mockRequest = {
                query: userQuery
            };
        });

        it('Should send empty array', async () => {
            jest.spyOn(UserService.prototype, 'getUsers').mockReturnValue(Promise.resolve([]));
            await controller.getUsers(mockRequest, res, next);
            expect(service.getUsers).toHaveBeenCalledWith(mockRequest.query);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory([]));
        });

        it('Should send empty array', async () => {
            const users: IResponseUserDto[] = [
                { id: v4(), login: '1', age: 12 },
                { id: v4(), login: '2', age: 12 }
            ];
            jest.spyOn(UserService.prototype, 'getUsers').mockReturnValue(Promise.resolve(users));
            await controller.getUsers(mockRequest, res, next);
            expect(service.getUsers).toHaveBeenCalledWith(mockRequest.query);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory(users));
        });

        it('Should call next with CustomException', async () => {
            const error = new CustomException(CustomException.name);
            jest.spyOn(UserService.prototype, 'getUsers').mockReturnValue(Promise.reject(error));
            await controller.getUsers(mockRequest, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getUserById', () => {
        let mockUserResponse: IResponseUserDto;
        let mockRequest: any;

        beforeAll(() => {
            mockUserResponse = { login: 'mockLogin', age: 12, id: v4() };
            mockRequest = { params: { userId: mockUserResponse.id } };
        });

        it('Should send user', async () => {
            jest.spyOn(UserService.prototype, 'getUserById').mockReturnValue(Promise.resolve(mockUserResponse));
            await controller.getUserById(mockRequest, res, next);
            expect(service.getUserById).toHaveBeenCalledWith(mockRequest.params.userId);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory(mockUserResponse));
        });

        it('Should call next with NullReferenceException', async () => {
            const error = new NullReferenceException(mockUserResponse.id);
            jest.spyOn(UserService.prototype, 'getUserById').mockReturnValue(Promise.reject(error));
            await controller.getUserById(mockRequest, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('createUser', () => {
        let mockUserDto: IUserDto;
        let mockUserResponse: IResponseUserDto;
        let mockRequest: any;

        beforeAll(() => {
            mockUserDto = { password: '12345', login: 'mockLogin', age: 12 };
            mockUserResponse = { login: 'mockLogin', age: 12, id: v4() };
            mockRequest = { body: mockUserDto };
        });

        it('Should send user', async () => {
            jest.spyOn(UserService.prototype, 'createUser').mockReturnValue(Promise.resolve(mockUserResponse));
            await controller.createUser(mockRequest, res, next);
            expect(service.createUser).toHaveBeenCalledWith(mockRequest.body);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory(mockUserResponse));
        });

        it('Should call next with CustomException', async () => {
            const error = new CustomException(CustomException.name);
            jest.spyOn(UserService.prototype, 'createUser').mockReturnValue(Promise.reject(error));
            await controller.createUser(mockRequest, res, next);
            expect(service.createUser).toHaveBeenCalledWith(mockRequest.body);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('updateUser', () => {
        let mockUserDto: IUserDto;
        let mockUserResponse: IResponseUserDto;
        let mockRequest: any;

        beforeAll(() => {
            mockUserDto = { password: '12345', login: 'mockLogin', age: 12 };
            mockUserResponse = { login: 'mockLogin', age: 12, id: v4() };
            mockRequest = {
                params: { userId: mockUserResponse.id },
                body: mockUserDto
            };
        });

        it('Should send user', async () => {
            jest.spyOn(UserService.prototype, 'updateUser').mockReturnValue(Promise.resolve(mockUserResponse));
            await controller.updateUser(mockRequest, res, next);
            expect(service.updateUser).toHaveBeenCalledWith(mockRequest.params.userId, mockRequest.body);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory(mockUserResponse));
        });

        it('Should call next with CustomException', async () => {
            const error = new CustomException(CustomException.name);
            jest.spyOn(UserService.prototype, 'updateUser').mockReturnValue(Promise.reject(error));
            await controller.updateUser(mockRequest, res, next);
            expect(service.updateUser).toHaveBeenCalledWith(mockRequest.params.userId, mockRequest.body);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('deleteUser', () => {
        let userId: string;
        let mockRequest: any;

        beforeAll(() => {
            userId = v4();
            mockRequest = {
                params: { userId }
            };
        });

        it('Should send user', async () => {
            jest.spyOn(UserService.prototype, 'deleteUser').mockReturnValue(Promise.resolve(true));
            await controller.deleteUser(mockRequest, res, next);
            expect(service.deleteUser).toHaveBeenCalledWith(mockRequest.params.userId);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory(true));
        });

        it('Should call next with CustomException', async () => {
            const error = new CustomException(CustomException.name);
            jest.spyOn(UserService.prototype, 'deleteUser').mockReturnValue(Promise.reject(error));
            await controller.deleteUser(mockRequest, res, next);
            expect(service.deleteUser).toHaveBeenCalledWith(mockRequest.params.userId);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('addUserToGroups', () => {
        let groupIdList: string[];
        let userId: string;
        let mockRequest: any;

        beforeAll(() => {
            userId = v4();
            groupIdList = [v4(), v4(), v4()];
            mockRequest = {
                params: { userId },
                body: { groupIdList }
            };
        });

        it('Should send user', async () => {
            jest.spyOn(UserService.prototype, 'addUserToGroups').mockReturnValue(Promise.resolve(true));
            await controller.addUserToGroups(mockRequest, res, next);
            expect(service.addUserToGroups).toHaveBeenCalledWith(mockRequest.params.userId, mockRequest.body.groupIdList);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory(true));
        });

        it('Should call next with CustomException', async () => {
            const error = new CustomException(CustomException.name);
            jest.spyOn(UserService.prototype, 'addUserToGroups').mockReturnValue(Promise.reject(error));
            await controller.addUserToGroups(mockRequest, res, next);
            expect(service.addUserToGroups).toHaveBeenCalledWith(mockRequest.params.userId, mockRequest.body.groupIdList);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});