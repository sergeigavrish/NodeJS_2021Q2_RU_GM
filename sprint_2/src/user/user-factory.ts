import { v4 } from 'uuid';
import { hashSaltFactory } from '../shared/auth/hashSaltFactory';
import { IUser } from './interfaces/iuser';
import { IUserDto } from './interfaces/iuser-dto';

export function userFactory(userDto: IUserDto): IUser {
    return {
        id: v4(),
        login: userDto.login,
        password: hashSaltFactory(userDto.password),
        age: userDto.age,
        isDeleted: false
    };
}
