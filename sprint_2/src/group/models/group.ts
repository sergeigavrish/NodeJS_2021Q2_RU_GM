import { Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManySetAssociationsMixin, Model, Sequelize } from 'sequelize';
import { User } from '../../user/models/user';
import { IGroup } from '../interfaces/igroup';
import { PermissionTypes } from '../types/permission-types';

export class Group extends Model implements IGroup {
  id!: string;
  name!: string;
  permissions!: PermissionTypes[];
  public setUsers!: HasManySetAssociationsMixin<User, string>;
  public readonly users?: User[];
  public static associations: {
    projects: Association<Group, User>;
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
        return this.getDataValue('permissions').split(',')
      },
      set(val: Array<PermissionTypes>) {
        this.setDataValue('permissions', val.join(','));
      },
    }
  }, {
    sequelize,
    modelName: Group.name,
    timestamps: false
  });

  return Group;
};
