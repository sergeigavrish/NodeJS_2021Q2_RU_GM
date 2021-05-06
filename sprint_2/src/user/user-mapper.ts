import { hashSaltFactory } from '../shared/auth/hashSaltFactory';
import { IUser } from './interfaces/iuser';
import { IUserDto } from './interfaces/iuser-dto';
import { IResponseUserDto } from './interfaces/iresponse-user-dto';

export class UserMapper {
    mapUserDtoToUser(dto: IUserDto, user: IUser): IUser {
        return {
            id: user.id,
            login: dto.login || user.login,
            password: dto.password ? hashSaltFactory(dto.password) : user.password,
            age: dto.age || user.age,
            isDeleted: user.isDeleted
        };
    }

    mapUserToUserDto(user: IUser): IResponseUserDto {
        return {
            id: user.id,
            login: user.login,
            age: user.age
        };
    }
}
