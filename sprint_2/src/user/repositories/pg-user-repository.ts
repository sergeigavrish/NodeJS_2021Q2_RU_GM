import { FindOptions } from 'sequelize';
import { logger } from '../../logger/bootstrap-logger';
import { CustomException } from '../../shared/errors/custom-exception';
import { MethodException } from '../../shared/errors/method-exception';
import { NullReferenceException } from '../../shared/errors/null-reference-exception';
import { removeKeysFromObject } from '../../utils/remove-fields';
import { IUser } from '../interfaces/iuser';
import { IUserQuery } from '../interfaces/iuser-query';
import { User } from '../models/user';
import { IUserRepository } from './iuser-repository';

export class PgUserRepository implements IUserRepository<IUser, Partial<IUserQuery>> {
    async read(options?: Partial<IUserQuery>): Promise<IUser[]> {
        try {
            const findOptions: FindOptions<IUser> = { where: { isDeleted: false } };
            if (options && options.limit) {
                findOptions.limit = options.limit;
            }
            if (options && options.login && findOptions.where) {
                findOptions.where = { ...findOptions.where, login: options.login };
            }
            return await User.findAll(findOptions);
        } catch (error) {
            error = this.handleError(error, this.read.name, options);
            throw error;
        }
    }

    async readById(id: string): Promise<IUser | null> {
        try {
            return await User.findByPk(id);
        } catch (error) {
            error = this.handleError(error, this.readById.name, id);
            throw error;
        }
    }

    async create(user: IUser): Promise<IUser> {
        try {
            return await User.create(user)
        } catch (error) {
            error = this.handleError(error, this.create.name, removeKeysFromObject(user, 'password'));
            throw error;
        }
    }

    async update(user: IUser): Promise<IUser> {
        try {
            return await User
                .update(user, { where: { id: user.id } })
                .then(([status, _]: [number, User[]]) => {
                    if (status === 1) {
                        return user;
                    }
                    throw new NullReferenceException(user.id);
                });
        } catch (error) {
            error = this.handleError(error, this.update.name, removeKeysFromObject(user, 'password'));
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            return await User.update({ isDeleted: true }, { where: { id } })
                .then(([status, _]: [number, User[]]) => {
                    if (status === 1) {
                        return true;
                    }
                    throw new NullReferenceException(id);
                });
        } catch (error) {
            error = this.handleError(error, this.delete.name, id);
            throw error;
        }
    }

    async addUserToGroups(userId: string, groupIdList: string[]): Promise<boolean> {
        try {
            const user = await User.findByPk(userId)
            if (!user) {
                throw new NullReferenceException(userId);
            }
            await user.setGroups(groupIdList);
            return true;
        } catch (error) {
            error = this.handleError(error, this.addUserToGroups.name, userId, groupIdList);
            throw error;
        }
    }

    private handleError(error: Error | CustomException, method: string, ...params: any[]): Error {
        if (!(error instanceof CustomException)) {
            error = new MethodException(error.message, method, params);
            logger.error({ message: error.message, label: PgUserRepository.name })
        }
        return error;
    }
}
