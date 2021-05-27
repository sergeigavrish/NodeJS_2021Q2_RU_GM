import { IUser } from '../interfaces/iuser';

export interface IUserRepository {
    read(): Promise<IUser[]>;
    readById(id: string): Promise<IUser | null>;
    readByLogin(login: string, limit: number): Promise<IUser[]>;
    create(user: IUser): Promise<IUser>;
    update(user: IUser): Promise<IUser>;
    delete(id: string): Promise<boolean>;
}
