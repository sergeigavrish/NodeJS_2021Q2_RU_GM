import { IRepository } from '../../shared/repositories/irepository';

export interface IUserRepository<T, L = any> extends IRepository<T, L> {
    addUserToGroups(userId: string, groupIdList: Array<string>): Promise<boolean>;
}