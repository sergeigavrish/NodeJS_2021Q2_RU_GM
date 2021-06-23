import { createValidator } from 'express-joi-validation';
import { array, number, object, string } from 'joi';
import { IUserDto } from './interfaces/iuser-dto';
import { IUserId } from './interfaces/iuser-id';
import { IUserQuery } from './interfaces/iuser-query';

const userValidator = createValidator({ passError: true });

const createUserDto = object<IUserDto>({
    login: string().min(1).required(),
    password: string().regex(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i).required(),
    age: number().min(4).max(130).required()
});

const updateUserDto = object<IUserDto>({
    login: string().min(1),
    password: string().regex(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i),
    age: number().min(4).max(130)
});

const userIdParam = object<IUserId>({
    userId: string().guid().required()
});

const getUserQuery = object<IUserQuery>({
    login: string().optional().default(''),
    limit: number().optional().min(1)
});

const addToGroup = object({
    groupIdList: array().items(string().guid())
});

export const queryUserValidator = userValidator.query(getUserQuery);
export const createUserValidator = userValidator.body(createUserDto);
export const updateUserValidator = userValidator.body(updateUserDto);
export const userIdParamValidator = userValidator.params(userIdParam);
export const addToGroupsValidator = userValidator.body(addToGroup);
