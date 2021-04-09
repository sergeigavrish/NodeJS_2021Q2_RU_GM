import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { ICreateUserDto, IResponseUserDto, IUpdateUserDto } from './interfaces/iuser-dto';
import { IUserQuery } from './interfaces/iuser-query';
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

    getUsers(query: Partial<IUserQuery>): Promise<IResponseUserDto[]> {
        if (!query.login && !query.limit) {
            return this.repository
                .read()
                .then(userList => userList.map(this.mapper.mapUserToUserDto));
        }
        if (!query.login) {
            query.login = '';
        }
        if (!query.limit) {
            query.limit = Infinity;
        } else {
            query.limit = Number(query.limit);
        }
        return this.repository
            .readByLogin(query.login, query.limit)
            .then(userList => userList.map(this.mapper.mapUserToUserDto));
    }

    getUserById(userId: string): Promise<IResponseUserDto> {
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

    createUser(dto: ICreateUserDto): Promise<IResponseUserDto> {
        const user = userFactory(dto);
        return this.repository
            .create(user)
            .then(this.mapper.mapUserToUserDto);
    }

    updateUser(dto: IUpdateUserDto): Promise<IResponseUserDto> {
        return this.repository
            .readById(dto.id)
            .then(user => {
                if (!user || user.isDeleted) {
                    throw new NullReferenceException(dto.id);
                }
                return this.mapper.mapUserDtoToUser(dto, user);
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
