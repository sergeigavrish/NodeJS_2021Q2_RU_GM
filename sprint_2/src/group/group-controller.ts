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
            res.send(successResponseFactory(await this.service.get()));
        } catch (error) {
            next(error);
        }
    }

    async getById(req: IValidatedReqParams<IGroupId>, res: Response<IResponse<IResponseGroupDto>>, next: NextFunction) {
        try {
            const groupId = req.params.groupId;
            res.json(successResponseFactory(await this.service.getById(groupId)));
        } catch (error) {
            next(error);
        }
    }

    async create(req: IValidatedReqBody<IGroupDto>, res: Response<IResponse<IResponseGroupDto>>, next: NextFunction) {
        try {
            const groupDto = req.body;
            res.send(successResponseFactory(await this.service.create(groupDto)));
        } catch (error) {
            next(error);
        }
    }

    async update(req: IValidatedReqBody<Partial<IGroupDto>>, res: Response<IResponse<IResponseGroupDto>>, next: NextFunction) {
        try {
            const groupId: string = req.params.groupId;
            const groupDto = req.body;
            res.send(successResponseFactory(await this.service.update(groupId, groupDto)));
        } catch (error) {
            next(error);
        }
    }

    async delete(req: IValidatedReqParams<IGroupId>, res: Response<IResponse<boolean>>, next: NextFunction) {
        try {
            const groupId: string = req.params.groupId;
            res.send(successResponseFactory(await this.service.delete(groupId)));
        } catch (error) {
            next(error);
        }
    }

    async addToGroup(req: IValidatedReqBody<Array<string>>, res: Response<IResponse<IResponseGroupDto>>, next: NextFunction) {
        try {
            const groupId: string = req.params.groupId;
            res.send(successResponseFactory(await this.service.addToGroup(groupId, req.body)));
        } catch (error) {
            next(error);
        }
    }
}

export const groupController = GroupController.getInstance(groupService);
