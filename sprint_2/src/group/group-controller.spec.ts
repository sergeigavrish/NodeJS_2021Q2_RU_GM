import { NextFunction, Response } from 'express';
import { v4 } from 'uuid';
import { CustomException } from '../shared/errors/custom-exception';
import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { successResponseFactory } from '../shared/response/responseFactory';
import { GroupController } from './group-controller';
import { GroupMapper } from './group-mapper';
import { GroupService } from './group-service';
import { IGroupDto } from './interfaces/igroup-dto';
import { IResponseGroupDto } from './interfaces/iresponse-group-dto';
import { PgGroupRepository } from './repositories/pg-group-repository';
import { PermissionTypes } from './types/permission-types';

describe('GroupController', () => {
    let controller: GroupController;
    let service: GroupService;
    let mapper: GroupMapper;
    let repository: PgGroupRepository;

    let res: Response;
    let next: NextFunction;


    beforeEach(() => {
        mapper = new GroupMapper();
        repository = new PgGroupRepository();
        service = new GroupService(mapper, repository);
        controller = new GroupController(service);
        res = {
            json: jest.fn()
        } as any as Response;
        next = jest.fn();
    });

    describe('get', () => {
        it('Should send empty array', async () => {
            jest.spyOn(GroupService.prototype, 'get').mockReturnValue(Promise.resolve([]));
            await controller.get(<any>{}, res, next);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory([]));
        });

        it('Should send array with groups', async () => {
            const groups: IResponseGroupDto[] = [
                { id: v4(), name: '1', permissions: [PermissionTypes.READ] },
                { id: v4(), name: '2', permissions: [PermissionTypes.WRITE] }
            ];
            jest.spyOn(GroupService.prototype, 'get').mockReturnValue(Promise.resolve(groups));
            await controller.get(<any>{}, res, next);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory(groups));
        });

        it('Should call next with CustomException', async () => {
            const error = new CustomException(CustomException.name);
            jest.spyOn(GroupService.prototype, 'get').mockReturnValue(Promise.reject(error));
            await controller.get(<any>{}, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getById', () => {
        let mockResponseGroupDto: IResponseGroupDto;
        let mockRequest: any;

        beforeAll(() => {
            mockResponseGroupDto = { id: v4(), name: '1', permissions: [PermissionTypes.READ] };
            mockRequest = {
                params: {
                    groupId: mockResponseGroupDto.id
                }
            };
        });

        it('Should send group', async () => {
            jest.spyOn(GroupService.prototype, 'getById').mockReturnValue(Promise.resolve(mockResponseGroupDto));
            await controller.getById(mockRequest, res, next);
            expect(service.getById).toHaveBeenCalledWith(mockRequest.params.groupId);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory(mockResponseGroupDto));
        });

        it('Should call next with NullReferenceException', async () => {
            const error = new NullReferenceException(mockResponseGroupDto.id);
            jest.spyOn(GroupService.prototype, 'getById').mockReturnValue(Promise.reject(error));
            await controller.getById(mockRequest, res, next);
            expect(service.getById).toHaveBeenCalledWith(mockRequest.params.groupId);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('create', () => {
        let mockGroupDto: IGroupDto;
        let mockGroupResponse: IResponseGroupDto;
        let mockRequest: any;

        beforeAll(() => {
            mockGroupDto = { name: '1', permissions: [PermissionTypes.READ] }
            mockGroupResponse = { ...mockGroupDto, id: v4() };
            mockRequest = { body: mockGroupDto };
        });

        it('Should return created group', async () => {
            jest.spyOn(GroupService.prototype, 'create').mockReturnValue(Promise.resolve(mockGroupResponse));
            await controller.create(mockRequest, res, next);
            expect(service.create).toHaveBeenCalledWith(mockRequest.body);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory(mockGroupResponse));
        });

        it('Should call next with CustomException', async () => {
            const error = new CustomException(CustomException.name);
            jest.spyOn(GroupService.prototype, 'create').mockReturnValue(Promise.reject(error));
            await controller.create(mockRequest, res, next);
            expect(service.create).toHaveBeenCalledWith(mockRequest.body);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('update', () => {
        let mockGroupDto: IGroupDto;
        let mockGroupResponse: IResponseGroupDto;
        let mockRequest: any;

        beforeAll(() => {
            mockGroupDto = { name: '1', permissions: [PermissionTypes.READ] }
            mockGroupResponse = { ...mockGroupDto, id: v4() };
            mockRequest = {
                params: { groupId: mockGroupResponse.id },
                body: mockGroupDto
            };
        });

        it('Should send updated group', async () => {
            jest.spyOn(GroupService.prototype, 'update').mockReturnValue(Promise.resolve(mockGroupResponse));
            await controller.update(mockRequest, res, next);
            expect(service.update).toHaveBeenCalledWith(mockRequest.params.groupId, mockRequest.body);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory(mockGroupResponse));
        });

        it('Should call next with CustomException', async () => {
            const error = new CustomException(CustomException.name);
            jest.spyOn(GroupService.prototype, 'update').mockReturnValue(Promise.reject(error));
            await controller.update(mockRequest, res, next);
            expect(service.update).toHaveBeenCalledWith(mockRequest.params.groupId, mockRequest.body);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('delete', () => {
        let groupId: string;
        let mockRequest: any;

        beforeAll(() => {
            groupId = v4();
            mockRequest = { params: { groupId } };
        });

        it('Should send true', async () => {
            jest.spyOn(GroupService.prototype, 'delete').mockReturnValue(Promise.resolve(true));
            await controller.delete(mockRequest, res, next);
            expect(service.delete).toHaveBeenCalledWith(mockRequest.params.groupId);
            expect(res.json).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(successResponseFactory(true));
        });

        it('Should call next with CustomException', async () => {
            const error = new CustomException(CustomException.name);
            jest.spyOn(GroupService.prototype, 'delete').mockReturnValue(Promise.reject(error));
            await controller.delete(mockRequest, res, next);
            expect(service.delete).toHaveBeenCalledWith(mockRequest.params.groupId);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});