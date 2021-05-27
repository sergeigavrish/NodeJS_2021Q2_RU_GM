import { IGroup } from './interfaces/igroup';
import { IGroupDto } from './interfaces/igroup-dto';
import { IResponseGroupDto } from './interfaces/iresponse-group-dto';

export class GroupMapper {
    mapGroupDtoToGroup(dto: Partial<IGroupDto>, item: IGroup): IGroup {
        return {
            id: item.id,
            name: dto.name || item.name,
            permissions: dto.permissions || item.permissions
        };
    }

    mapGroupToResponseGroupDto(item: IGroup): IResponseGroupDto {
        return {
            id: item.id,
            name: item.name,
            permissions: item.permissions
        };
    }
}
