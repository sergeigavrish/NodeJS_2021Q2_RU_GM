import { NullReferenceException } from '../../shared/errors/null-reference-exception';
import { IGroup } from '../interfaces/igroup';
import { Group } from '../models/group';
import { IGroupRepository } from './igroup-repository';

export class PgGroupRepository implements IGroupRepository {
    async updateUserGroup(groupId: string, listUserId: string[]): Promise<IGroup> {
        // return 
        try {
            return await Group.findByPk(groupId).then(group => {
                if (!group) {
                    throw new NullReferenceException(groupId);
                }
                group.setUsers(listUserId);
                return group;
            });
        } catch (error) {
            throw error;
        }
    }

    async read(): Promise<IGroup[]> {
        try {
            return await Group.findAll();
        } catch (error) {
            throw error;
        }
    }

    async readById(id: string): Promise<IGroup | null> {
        try {
            return await Group.findByPk(id);
        } catch (error) {
            throw error;
        }
    }

    async create(user: IGroup): Promise<IGroup> {
        try {
            return await Group.create(user)
        } catch (error) {
            throw error;
        }
    }

    async update(item: IGroup): Promise<IGroup> {
        try {
            return await Group
                .update(item, { where: { id: item.id } })
                .then(([status, _]: [number, Group[]]) => {
                    if (status === 1) {
                        return item;
                    }
                    throw new NullReferenceException(item.id);
                });
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            return await Group.destroy({ where: { id } })
                .then((status: number) => {
                    if (status === 1) {
                        return true;
                    }
                    throw new NullReferenceException(id);
                });
        } catch (error) {
            throw error;
        }
    }
}
