import { PermissionTypes } from '../types/permission-types';

export interface IGroup {
    id: string;
    name: string;
    permissions: Array<PermissionTypes>
}
