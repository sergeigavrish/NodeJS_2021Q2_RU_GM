import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { groupFactory } from './group-factory';
import { GroupMapper } from './group-mapper';
import { IGroup } from './interfaces/igroup';
import { IResponseGroupDto } from './interfaces/iresponse-group-dto';
import { IGroupDto } from './interfaces/igroup-dto';
import { IRepository } from '../shared/repositories/irepository';
import { CustomException } from '../shared/errors/custom-exception';
import { MethodException } from '../shared/errors/method-exception';
import { logger } from '../logger/bootstrap-logger';

export class GroupService {
    constructor(
        private mapper: GroupMapper,
        private repository: IRepository<IGroup>
    ) { }

    get(): Promise<IResponseGroupDto[]> {
        return this.repository
            .read()
            .then(list => list.map(this.mapper.mapGroupToResponseGroupDto))
            .catch(this.handleError(this.getById.name));
    }

    getById(id: string): Promise<IResponseGroupDto> {
        return this.repository
            .readById(id)
            .then(group => this.checkItem(id, group))
            .then(this.mapper.mapGroupToResponseGroupDto)
            .catch(this.handleError(this.getById.name, id));
    }

    create(dto: IGroupDto): Promise<IResponseGroupDto> {
        const group = groupFactory(dto);
        return this.repository
            .create(group)
            .then(this.mapper.mapGroupToResponseGroupDto)
            .catch(this.handleError(this.create.name, dto));
    }

    update(groupId: string, dto: Partial<IGroupDto>): Promise<IResponseGroupDto> {
        return this.repository
            .readById(groupId)
            .then(group => this.checkItem(groupId, group))
            .then(group => this.mapper.mapGroupDtoToGroup(dto, group))
            .then(group => this.repository.update(group))
            .then(this.mapper.mapGroupToResponseGroupDto)
            .catch(this.handleError(this.update.name, groupId, dto));
    }

    delete(groupId: string): Promise<boolean> {
        return this.repository
            .readById(groupId)
            .then(group => this.checkItem(groupId, group))
            .then(_ => this.repository.delete(groupId))
            .catch(this.handleError(this.delete.name, groupId));
    }

    private checkItem(id: string, item: IGroup | null) {
        if (!item) {
            throw new NullReferenceException(id);
        }
        return item;
    }

    private handleError(method: string, ...params: any[]) {
        return (error: Error | CustomException) => {
            if (!(error instanceof CustomException)) {
                error = new MethodException(error.message, method, params);
                logger.error({ message: error.message, label: GroupService.name });
            }
            throw error;
        }
    }
}
