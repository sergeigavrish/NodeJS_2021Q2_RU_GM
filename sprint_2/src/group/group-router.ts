import express, { Request, Response, NextFunction } from 'express';
import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { IResponse } from '../shared/response/iresponse';
import { failResponseFactory } from '../shared/response/responseFactory';
import { validationResultGuard } from '../shared/validation/validation-error-guard';
import { validationErrorMapper } from '../shared/validation/validation-error-mapper';
import { GroupController } from './group-controller';
import { GroupMapper } from './group-mapper';
import { GroupService } from './group-service';
import { createGroupValidator, groupIdParamValidator, updateGroupValidator } from './group-validator';
import { PgGroupRepository } from './repositories/pg-group-repository';

export const groupRouter = express.Router();
const groupMapper = new GroupMapper();
const groupRepository = new PgGroupRepository();
const groupService = new GroupService(groupMapper, groupRepository);
const groupController = new GroupController(groupService);

groupRouter
    .route('/')
    .get(
        groupController.get.bind(groupController)
    )
    .post(
        createGroupValidator,
        groupController.create.bind(groupController)
    );

groupRouter
    .route('/:groupId')
    .get(
        groupIdParamValidator,
        groupController.getById.bind(groupController)
    )
    .put(
        groupIdParamValidator,
        updateGroupValidator,
        groupController.update.bind(groupController)
    )
    .delete(
        groupIdParamValidator,
        groupController.delete.bind(groupController)
    );

groupRouter.use((error: Error, _: Request, res: Response<IResponse>, next: NextFunction) => {
    if (error instanceof NullReferenceException) {
        return res.status(404).json(failResponseFactory([{ message: error.message }]));
    }
    if (validationResultGuard(error) && error.error) {
        return res.status(400).json(failResponseFactory(validationErrorMapper(error.error)));
    }
    return next(error);
});
