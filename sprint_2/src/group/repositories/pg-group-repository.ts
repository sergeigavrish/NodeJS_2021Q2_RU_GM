import { logger } from '../../logger/bootstrap-logger';
import { CustomException } from '../../shared/errors/custom-exception';
import { MethodException } from '../../shared/errors/method-exception';
import { NullReferenceException } from '../../shared/errors/null-reference-exception';
import { IRepository } from '../../shared/repositories/irepository';
import { IGroup } from '../interfaces/igroup';
import { Group } from '../models/group';

export class PgGroupRepository implements IRepository<IGroup> {
    async read(): Promise<IGroup[]> {
        try {
            return await Group.findAll();
        } catch (error) {
            error = this.handleError(error, this.create.name);
            throw error;
        }
    }

    async readById(id: string): Promise<IGroup | null> {
        try {
            return await Group.findByPk(id);
        } catch (error) {
            error = this.handleError(error, this.create.name, id);
            throw error;
        }
    }

    async create(item: IGroup): Promise<IGroup> {
        try {
            return await Group.create(item)
        } catch (error) {
            error = this.handleError(error, this.create.name, item);
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
            error = this.handleError(error, this.update.name, item);
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
            error = this.handleError(error, this.delete.name, id);
            throw error;
        }
    }

    private handleError(error: Error | CustomException, method: string, ...params: any[]): Error {
        if (!(error instanceof CustomException)) {
            error = new MethodException(error.message, method, params);
            logger.error({ message: error.message, label: PgGroupRepository.name })
        }
        return error;
    }
}
