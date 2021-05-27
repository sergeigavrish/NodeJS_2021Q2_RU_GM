import { IUser } from '../interfaces/iuser';
import { IUserRepository } from './iuser-repository';

export class InMemoryUserRepository implements IUserRepository {
    private readonly userMap = new Map<string, IUser>();

    async read(): Promise<IUser[]> {
        try {
            return Array.from(this.userMap.values());
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

    async readByLogin(login: string, limit: number): Promise<IUser[]> {
        try {
            const iterator: IterableIterator<IUser> = this.userMap.values();
            const result: IUser[] = [];
            let user: IUser;
            while ((user = iterator.next().value) && result.length < limit) {
                if (!user.isDeleted && user.login.toLocaleLowerCase().includes(login.toLocaleLowerCase())) {
                    result.push(user);
                }
            }
            return result;
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
