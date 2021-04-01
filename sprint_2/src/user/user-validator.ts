import { createValidator } from 'express-joi-validation';
import { number, object, string } from 'joi';
import { IUserDto } from './interfaces/iuser-dto';
import { IUserId } from './interfaces/iuser-id';
import { IUserQuery } from './interfaces/iuser-query';

const userValidator = createValidator();

const userDtoScheme = {
    login: string().min(1).required(),
    password: string().regex(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i).required(),
    age: number().min(4).max(130).required()
};

const createUserDto = object<IUserDto>(userDtoScheme);

const updateUserDto = object<Required<IUserDto>>({
    id: string().guid().required(),
    ...userDtoScheme
});

const userIdParam = object<IUserId>({
    userId: string().guid().required()
});

const userQuery = object<IUserQuery>({
    login: string().required(),
    limit: number().required()
});

export const createUserValidator = userValidator.body(createUserDto);
export const updateUserValidator = userValidator.body(updateUserDto);
export const userIdParamValidator = userValidator.params(userIdParam);
export const userQueryValidator = userValidator.query(userQuery);
