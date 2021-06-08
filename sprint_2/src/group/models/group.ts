import { Association, DataTypes, Model, Sequelize } from 'sequelize';
import { User } from '../../user/models/user';
import { IGroup } from '../interfaces/igroup';
import { PermissionTypes } from '../types/permission-types';

type IPermissionsKey = keyof Pick<IGroup, 'permissions'>;
const PERMISSIONS: IPermissionsKey = 'permissions';
const SEPARATOR = ',';

export class Group extends Model implements IGroup {
  id!: string;
  name!: string;
  permissions!: PermissionTypes[];
  public readonly users?: User[];
  public static associations: {
    users: Association<Group, User>;
  };
};

export function groupModelInitialization(sequelize: Sequelize): typeof Group {
  Group.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    permissions: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return this.getDataValue<IPermissionsKey>(PERMISSIONS).split(SEPARATOR)
      },
      set(val: Array<PermissionTypes>) {
        this.setDataValue<IPermissionsKey>(PERMISSIONS, val.join(SEPARATOR));
      },
    }
  }, {
    sequelize,
    modelName: Group.name,
    timestamps: false
  });

  return Group;
};
