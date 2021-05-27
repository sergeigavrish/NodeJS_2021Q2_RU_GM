import { IUser } from '../interfaces/iuser';
import { IUserQuery } from '../interfaces/iuser-query';
import { IRepository } from '../../shared/repositories/irepository';
import { logger } from '../../logger/bootstrap-logger';
import { CustomException } from '../../shared/errors/custom-exception';
import { MethodException } from '../../shared/errors/method-exception';
import { removeKeysFromObject } from '../../utils/remove-fields';

export class InMemoryUserRepository implements IRepository<IUser, Partial<IUserQuery>> {
    private readonly userMap = new Map<string, IUser>();

    async read(options: Partial<IUserQuery> = {login: ''}): Promise<IUser[]> {
        try {
            if (!options.limit) {
                options.limit = Infinity;
            }
            const iterator: IterableIterator<IUser> = this.userMap.values();
            const result: IUser[] = [];
            let user: IUser;
            while ((user = iterator.next().value) && result.length < options.limit) {
                if (!user.isDeleted) {
                    if (options.login && user.login.toLocaleLowerCase().includes(options.login.toLocaleLowerCase())) {
                        result.push(user);
                        continue;
                    }
                    result.push(user);
                }
            }
            return result;
        } catch (error) {
            error = this.handleError(error, this.read.name, options);
            throw error;
        }
    }

    async readById(id: string): Promise<IUser | null> {
        try {
            return this.userMap.get(id) || null;
        } catch (error) {
            error = this.handleError(error, this.readById.name, id);
            throw error;
        }
    }

    async create(user: IUser): Promise<IUser> {
        try {
            this.userMap.set(user.id, user);
            return user;
        } catch (error) {
            error = this.handleError(error, this.create.name, removeKeysFromObject(user, 'password'));
            throw error;
        }
    }

    async update(user: IUser): Promise<IUser> {
        try {
            this.userMap.set(user.id, user);
            return user;
        } catch (error) {
            error = this.handleError(error, this.update.name, removeKeysFromObject(user, 'password'));
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const user = this.userMap.get(id);
            if (!user) {
                return false;
            }
            user.isDeleted = true;
            return true;
        } catch (error) {
            error = this.handleError(error, this.delete.name, id);
            throw error;
        }
    }

    private handleError(error: Error | CustomException, method: string, ...params: any[]): Error {
        if (!(error instanceof CustomException)) {
            error = new MethodException(error.message, method, params);
            logger.error({ message: error.message, label: InMemoryUserRepository.name })
        }
        return error;
    }
}
