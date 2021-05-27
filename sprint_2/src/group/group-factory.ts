import { v4 } from 'uuid';
import { IGroup } from './interfaces/igroup';
import { IGroupDto } from './interfaces/igroup-dto';

export function groupFactory(item: IGroupDto): IGroup {
    return {
        id: v4(),
        name: item.name,
        permissions: item.permissions
    };
}
