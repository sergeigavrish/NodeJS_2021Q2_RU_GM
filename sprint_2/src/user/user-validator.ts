import { createValidator } from 'express-joi-validation';
import { number, object, string } from 'joi';
import { ICreateUserDto, IUpdateUserDto } from './interfaces/iuser-dto';
import { IUserId } from './interfaces/iuser-id';

const userValidator = createValidator({ passError: true });

const createUserDto = object<ICreateUserDto>({
    login: string().min(1).required(),
    password: string().regex(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i).required(),
    age: number().min(4).max(130).required()
});

const updateUserDto = object<IUpdateUserDto>({
    id: string().guid().required(),
    login: string().min(1),
    password: string().regex(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i),
    age: number().min(4).max(130)
});

const userIdParam = object<IUserId>({
    userId: string().guid().required()
});

export const createUserValidator = userValidator.body(createUserDto);
export const updateUserValidator = userValidator.body(updateUserDto);
export const userIdParamValidator = userValidator.params(userIdParam);
