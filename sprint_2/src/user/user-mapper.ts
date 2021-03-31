import { IUser } from './interfaces/iuser';
import { IUserDto } from './interfaces/iuser-dto';

export class UserMapper {
    mapUserDtoToUser(dto: Required<IUserDto>, isDeleted: boolean): IUser {
        return {
            id: dto.id,
            login: dto.login,
            password: dto.password,
            age: dto.age,
            isDeleted
        };
    }

    mapUserToUserDto(user: IUser): IUserDto {
        return {
            id: user.id,
            login: user.login,
            password: user.password,
            age: user.age
        };
    }
}
