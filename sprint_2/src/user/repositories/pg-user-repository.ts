import { FindOptions } from 'sequelize';
import { dbContext } from '../../db/db-context';
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
        const transaction = await dbContext.sequelize.transaction();
        try {
            const result = await User.create(user, { transaction });
            transaction.commit();
            return result
        } catch (error) {
            transaction.rollback();
            error = this.handleError(error, this.create.name, removeKeysFromObject(user, 'password'));
            throw error;
        }
    }

    async update(user: IUser): Promise<IUser> {
        const transaction = await dbContext.sequelize.transaction();
        try {
            const [status, _]: [number, User[]] = await User.update(user, { where: { id: user.id }, transaction });
            if (status === 1) {
                transaction.commit();
                return user;
            }
            throw new NullReferenceException(user.id);
        } catch (error) {
            transaction.rollback();
            error = this.handleError(error, this.update.name, removeKeysFromObject(user, 'password'));
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        const transaction = await dbContext.sequelize.transaction();
        try {
            const user = await User.findByPk(id, { transaction });
            if (!user) {
                throw new NullReferenceException(id);
            }
            await user.update({ isDeleted: true }, { transaction });
            await user.setGroups([], { transaction });
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            error = this.handleError(error, this.delete.name, id);
            throw error;
        }
    }

    async addUserToGroups(userId: string, groupIdList: string[]): Promise<boolean> {
        const transaction = await dbContext.sequelize.transaction();
        try {
            const user = await User.findByPk(userId)
            if (!user) {
                throw new NullReferenceException(userId);
            }
            await user.setGroups(groupIdList, { transaction });
            transaction.commit();
            return true;
        } catch (error) {
            transaction.rollback();
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
