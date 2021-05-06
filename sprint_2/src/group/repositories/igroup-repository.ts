import { IRepository } from '../../shared/repositories/irepository';
import { IGroup } from '../interfaces/igroup';

export interface IGroupRepository extends IRepository<IGroup> {
    updateUserGroup(groupId:string, listUserId: Array<string>): Promise<IGroup>;
}