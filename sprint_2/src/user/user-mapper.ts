import { hashSaltFactory } from '../shared/auth/hashSaltFactory';
import { IUser } from './interfaces/iuser';
import { IResponseUserDto, IUpdateUserDto } from './interfaces/iuser-dto';

export class UserMapper {
    mapUserDtoToUser(dto: IUpdateUserDto, user: IUser): IUser {
        return {
            id: dto.id,
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
