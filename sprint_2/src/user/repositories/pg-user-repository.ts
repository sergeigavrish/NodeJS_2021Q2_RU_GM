import { FindOptions } from 'sequelize';
import { NullReferenceException } from '../../shared/errors/null-reference-exception';
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
            throw error;
        }
    }

    async readById(id: string): Promise<IUser | null> {
        try {
            return await User.findByPk(id);
        } catch (error) {
            throw error;
        }
    }

    async create(user: IUser): Promise<IUser> {
        try {
            return await User.create(user)
        } catch (error) {
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
            throw error;
        }
    }
}
