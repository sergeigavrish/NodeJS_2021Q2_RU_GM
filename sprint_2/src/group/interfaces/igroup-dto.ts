import { PermissionTypes } from '../types/permission-types';

export interface IGroupDto {
    id?: string;
    name: string;
    permissions: Array<PermissionTypes>
}
