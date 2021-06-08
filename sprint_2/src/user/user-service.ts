import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { IUser } from './interfaces/iuser';
import { IUserDto } from './interfaces/iuser-dto';
import { IUserQuery } from './interfaces/iuser-query';
import { PgUserRepository } from './repositories/pg-user-repository';
import { userFactory } from './user-factory';
import { UserMapper } from './user-mapper';
import { IResponseUserDto } from './interfaces/iresponse-user-dto';
import { IUserRepository } from './repositories/iuser-repository';
import { CustomException } from '../shared/errors/custom-exception';
import { MethodException } from '../shared/errors/method-exception';
import { removeKeysFromObject } from '../utils/remove-fields';
import { logger } from '../logger/bootstrap-logger';

export class UserService {
    private static instance: UserService;

    private constructor(
        private mapper: UserMapper,
        private repository: IUserRepository<IUser, Partial<IUserQuery>>
    ) { }

    static getInstance(mapper: UserMapper, repository: IUserRepository<IUser, Partial<IUserQuery>>): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService(mapper, repository);
        }
        return UserService.instance;
    }

    getUsers(query: IUserQuery): Promise<IResponseUserDto[]> {
        const { login, limit } = query;
        return this.repository
            .read({ login, limit })
            .then(userList => userList.map(this.mapper.mapUserToUserDto))
            .catch(
                this.handleError(this.getUsers.name, query)
            );
    }

    getUserById(userId: string): Promise<IResponseUserDto> {
        return this.repository
            .readById(userId)
            .then(user => this.checkUser(userId, user))
            .then(this.mapper.mapUserToUserDto)
            .catch(
                this.handleError(this.getUserById.name, userId)
            );
    }

    createUser(dto: IUserDto): Promise<IResponseUserDto> {
        const user = userFactory(dto);
        return this.repository
            .create(user)
            .then(this.mapper.mapUserToUserDto)
            .catch(
                this.handleError(
                    this.createUser.name,
                    removeKeysFromObject(dto, 'password')
                )
            );
    }

    updateUser(userId: string, dto: IUserDto): Promise<IResponseUserDto> {
        return this.repository
            .readById(userId)
            .then(user => this.checkUser(userId, user))
            .then(user => this.mapper.mapUserDtoToUser(dto, user))
            .then(user => this.repository.update(user))
            .then(this.mapper.mapUserToUserDto)
            .catch(
                this.handleError(
                    this.updateUser.name,
                    userId,
                    removeKeysFromObject(dto, 'password')
                )
            );
    }

    deleteUser(userId: string): Promise<boolean> {
        return this.repository
            .readById(userId)
            .then(user => this.checkUser(userId, user))
            .then(_ => this.repository.delete(userId))
            .catch(
                this.handleError(this.deleteUser.name, userId)
            );
    }

    addUserToGroups(userId: string, groupIdList: Array<string>): Promise<boolean> {
        return this.repository
            .addUserToGroups(userId, groupIdList)
            .catch(
                this.handleError(this.addUserToGroups.name, userId, groupIdList)
            );
    }

    private checkUser(userId: string, user: IUser | null) {
        if (!user || user.isDeleted) {
            throw new NullReferenceException(userId);
        }
        return user;
    }

    private handleError(method: string, ...params: any[]) {
        return (error: Error | CustomException) => {
            if (!(error instanceof CustomException)) {
                error = new MethodException(error.message, method, params);
                logger.error({ message: error.message, label: UserService.name });
            }
            throw error;
        }
    }
}

export const userService = UserService.getInstance(
    new UserMapper(),
    new PgUserRepository()
);
