import { NextFunction, Response, Request } from 'express';
import { IValidatedReqBody, IValidatedReqParams } from '../shared/request/ivalidated-request';
import { IResponse } from '../shared/response/iresponse';
import { successResponseFactory } from '../shared/response/responseFactory';
import { IGroupId } from './interfaces/igroup-id';
import { GroupService, groupService } from './group-service';
import { IGroupDto } from './interfaces/igroup-dto';
import { IResponseGroupDto } from './interfaces/iresponse-group-dto';

export class GroupController {
    private static instance: GroupController;

    private constructor(
        private service: GroupService
    ) { }

    static getInstance(service: GroupService): GroupController {
        if (!GroupController.instance) {
            GroupController.instance = new GroupController(service);
        }
        return GroupController.instance;
    }

    async get(_: Request, res: Response<IResponse<IResponseGroupDto[]>>, next: NextFunction) {
        try {
            const groups = await this.service.get();
            const response = successResponseFactory(groups);
            return res.json(response);
        } catch (error) {
            return next(error);
        }
    }

    async getById(req: IValidatedReqParams<IGroupId>, res: Response<IResponse<IResponseGroupDto>>, next: NextFunction) {
        try {
            const groupId = req.params.groupId;
            const group = await this.service.getById(groupId);
            const response = successResponseFactory(group);
            return res.json(response);
        } catch (error) {
            return next(error);
        }
    }

    async create(req: IValidatedReqBody<IGroupDto>, res: Response<IResponse<IResponseGroupDto>>, next: NextFunction) {
        try {
            const groupDto = req.body;
            const group = await this.service.create(groupDto);
            const response = successResponseFactory(group);
            return res.json(response);
        } catch (error) {
            return next(error);
        }
    }

    async update(req: IValidatedReqBody<Partial<IGroupDto>>, res: Response<IResponse<IResponseGroupDto>>, next: NextFunction) {
        try {
            const groupId: string = req.params.groupId;
            const groupDto = req.body;
            const group = await this.service.update(groupId, groupDto);
            const response = successResponseFactory(group);
            return res.json(response);
        } catch (error) {
            return next(error);
        }
    }

    async delete(req: IValidatedReqParams<IGroupId>, res: Response<IResponse<boolean>>, next: NextFunction) {
        try {
            const groupId: string = req.params.groupId;
            const isDeleted = await this.service.delete(groupId);
            const response = successResponseFactory(isDeleted);
            return res.json(response);
        } catch (error) {
            return next(error);
        }
    }
}

export const groupController = GroupController.getInstance(groupService);
