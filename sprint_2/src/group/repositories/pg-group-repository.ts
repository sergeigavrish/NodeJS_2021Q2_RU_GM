import { NullReferenceException } from '../../shared/errors/null-reference-exception';
import { IRepository } from '../../shared/repositories/irepository';
import { IGroup } from '../interfaces/igroup';
import { Group } from '../models/group';

export class PgGroupRepository implements IRepository<IGroup> {
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
