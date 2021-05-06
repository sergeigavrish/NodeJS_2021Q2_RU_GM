import { NullReferenceException } from '../shared/errors/null-reference-exception';
import { groupFactory } from './group-factory';
import { GroupMapper } from './group-mapper';
import { IGroup } from './interfaces/igroup';
import { IResponseGroupDto } from './interfaces/iresponse-group-dto';
import { IGroupDto } from './interfaces/igroup-dto';
import { PgGroupRepository } from './repositories/pg-group-repository';
import { IGroupRepository } from './repositories/igroup-repository';

export class GroupService {
    private static instance: GroupService;

    private constructor(
        private mapper: GroupMapper,
        private repository: IGroupRepository
    ) { }

    static getInstance(mapper: GroupMapper, repository: IGroupRepository): GroupService {
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
            .then(user => this.checkItem(id, user))
            .then(this.mapper.mapGroupToResponseGroupDto);
    }

    create(dto: IGroupDto): Promise<IResponseGroupDto> {
        const user = groupFactory(dto);
        return this.repository
            .create(user)
            .then(this.mapper.mapGroupToResponseGroupDto);
    }

    update(userId: string, dto: Partial<IGroupDto>): Promise<IResponseGroupDto> {
        return this.repository
            .readById(userId)
            .then(user => this.checkItem(userId, user))
            .then(user => this.mapper.mapGroupDtoToGroup(dto, user))
            .then(user => this.repository.update(user))
            .then(this.mapper.mapGroupToResponseGroupDto);
    }

    delete(userId: string): Promise<boolean> {
        return this.repository
            .readById(userId)
            .then(user => this.checkItem(userId, user))
            .then(_ => this.repository.delete(userId));
    }

    addToGroup(groupId: string, userIdList: Array<string>): Promise<IResponseGroupDto> {
        console.log(userIdList);
        return this.repository
            .updateUserGroup(groupId, userIdList)
            .then(this.mapper.mapGroupToResponseGroupDto);
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
