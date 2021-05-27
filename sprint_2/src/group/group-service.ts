import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { groupFactory } from './group-factory';
import { GroupMapper } from './group-mapper';
import { IGroup } from './interfaces/igroup';
import { IResponseGroupDto } from './interfaces/iresponse-group-dto';
import { IGroupDto } from './interfaces/igroup-dto';
import { PgGroupRepository } from './repositories/pg-group-repository';
import { IRepository } from '../shared/repositories/irepository';

export class GroupService {
    private static instance: GroupService;

    private constructor(
        private mapper: GroupMapper,
        private repository: IRepository<IGroup>
    ) { }

    static getInstance(mapper: GroupMapper, repository: IRepository<IGroup>): GroupService {
        if (!GroupService.instance) {
            GroupService.instance = new GroupService(mapper, repository);
        }
        return GroupService.instance;
    }

    get(): Promise<IResponseGroupDto[]> {
        return this.repository
            .read()
            .then(list => list.map(this.mapper.mapGroupToResponseGroupDto));
    }

    getById(id: string): Promise<IResponseGroupDto> {
        return this.repository
            .readById(id)
            .then(group => this.checkItem(id, group))
            .then(this.mapper.mapGroupToResponseGroupDto);
    }

    create(dto: IGroupDto): Promise<IResponseGroupDto> {
        const group = groupFactory(dto);
        return this.repository
            .create(group)
            .then(this.mapper.mapGroupToResponseGroupDto);
    }

    update(groupId: string, dto: Partial<IGroupDto>): Promise<IResponseGroupDto> {
        return this.repository
            .readById(groupId)
            .then(group => this.checkItem(groupId, group))
            .then(group => this.mapper.mapGroupDtoToGroup(dto, group))
            .then(group => this.repository.update(group))
            .then(this.mapper.mapGroupToResponseGroupDto);
    }

    delete(groupId: string): Promise<boolean> {
        return this.repository
            .readById(groupId)
            .then(group => this.checkItem(groupId, group))
            .then(_ => this.repository.delete(groupId));
    }

    private checkItem(id: string, item: IGroup | null) {
        if (!item) {
            throw new NullReferenceException(id);
        }
        return item;
    }
}

export const groupService = GroupService.getInstance(
    new GroupMapper(),
    new PgGroupRepository()
);
