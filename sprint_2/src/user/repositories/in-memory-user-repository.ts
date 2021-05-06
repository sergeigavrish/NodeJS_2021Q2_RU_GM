import { IUser } from '../interfaces/iuser';
import { IUserQuery } from '../interfaces/iuser-query';
import { IRepository } from '../../shared/repositories/irepository';

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
            throw error;
        }
    }

    async readById(id: string): Promise<IUser | null> {
        try {
            return this.userMap.get(id) || null;
        } catch (error) {
            throw error;
        }
    }

    async create(user: IUser): Promise<IUser> {
        try {
            this.userMap.set(user.id, user);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async update(user: IUser): Promise<IUser> {
        try {
            this.userMap.set(user.id, user);
            return user;
        } catch (error) {
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
            throw error;
        }
    }
}
