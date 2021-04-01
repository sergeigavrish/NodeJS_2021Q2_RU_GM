import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { IUserDto } from './interfaces/iuser-dto';
import { InMemoryUserRepository } from './repositories/in-memory-user-repository';
import { IUserRepository } from './repositories/iuser-repository';
import { userFactory } from './user-factory';
import { UserMapper } from './user-mapper';

export class UserService {
    private static instance: UserService;

    private constructor(
        private mapper: UserMapper,
        private repository: IUserRepository
    ) { }

    static getInstance(mapper: UserMapper, repository: IUserRepository): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService(mapper, repository);
        }
        return UserService.instance;
    }

    getUserById(userId: string): Promise<IUserDto> {
        return this.repository
            .readById(userId)
            .then(user => {
                if (!user || user.isDeleted) {
                    throw new NullReferenceException(userId);
                }
                return user;
            })
            .then(this.mapper.mapUserToUserDto);
    }

    getUsersByLogin(login: string, limit: number): Promise<IUserDto[]> {
        return this.repository
            .readByLogin(login, limit)
            .then(userList => userList.map(this.mapper.mapUserToUserDto));
    }

    createUser(dto: IUserDto): Promise<IUserDto> {
        const user = userFactory(dto);
        return this.repository
            .create(user)
            .then(this.mapper.mapUserToUserDto);
    }

    updateUser(dto: Required<IUserDto>): Promise<IUserDto> {
        return this.repository
            .readById(dto.id)
            .then(user => {
                if (!user || user.isDeleted) {
                    throw new NullReferenceException(dto.id);
                }
                return this.mapper.mapUserDtoToUser(dto, user.isDeleted);
            })
            .then(user => this.repository.update(user))
            .then(this.mapper.mapUserToUserDto);
    }

    deleteUser(userId: string): Promise<boolean> {
        return this.repository
            .readById(userId)
            .then(user => {
                if (!user || user.isDeleted) {
                    throw new NullReferenceException(userId);
                }
                return this.repository.delete(userId);
            });
    }
}

export const userService = UserService.getInstance(
    new UserMapper(),
    new InMemoryUserRepository()
);
