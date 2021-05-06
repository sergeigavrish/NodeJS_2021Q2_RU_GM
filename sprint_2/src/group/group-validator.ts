import { createValidator } from 'express-joi-validation';
import { array, object, string } from 'joi';
import { values } from '../utils/values';
import { IGroup } from './interfaces/igroup';
import { IGroupId } from './interfaces/igroup-id';
import { PermissionTypes } from './types/permission-types';

const groupValidator = createValidator({ passError: true });

const createGroupDto = object<IGroup>({
    name: string().min(1).required(),
    permissions: array().items(string().valid(...values<string>(PermissionTypes))).required(),
});

const updateGroupDto = object<IGroup>({
    name: string().min(1),
    permissions: array().items(string().valid(...values<string>(PermissionTypes))),
});

const groupIdParam = object<IGroupId>({
    groupId: string().guid().required()
});

const addToGroup = array().items(string().guid());

export const createGroupValidator = groupValidator.body(createGroupDto);
export const updateGroupValidator = groupValidator.body(updateGroupDto);
export const groupIdParamValidator = groupValidator.params(groupIdParam);
export const addToGroupValidator = groupValidator.body(addToGroup);
