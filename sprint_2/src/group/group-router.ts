import express, { Request, Response, NextFunction } from 'express';
import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { IResponse } from '../shared/response/iresponse';
import { failResponseFactory } from '../shared/response/responseFactory';
import { validationResultGuard } from '../shared/validation/validation-error-guard';
import { validationErrorMapper } from '../shared/validation/validation-error-mapper';
import { groupController } from './group-controller';
import { addToGroupValidator, createGroupValidator, groupIdParamValidator, updateGroupValidator } from './group-validator';

export const groupRouter = express.Router();

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
    .post(
        addToGroupValidator,
        groupController.addToGroup.bind(groupController)
    )
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
        res.status(404).json(failResponseFactory([{ message: error.message }]));
        return;
    }
    if (validationResultGuard(error) && error.error) {
        res.status(400).json(failResponseFactory(validationErrorMapper(error.error)));
        return;
    }
    next(error);
});
