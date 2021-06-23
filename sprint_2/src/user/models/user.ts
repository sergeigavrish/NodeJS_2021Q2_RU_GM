'use strict';
import { Association, DataTypes, HasManySetAssociationsMixin, Model, Sequelize } from 'sequelize';
import { Group } from '../../group/models/group';
import { IUser } from '../interfaces/iuser';

export class User extends Model<IUser> implements IUser {
  id!: string;
  login!: string;
  password!: string;
  age!: number;
  isDeleted!: boolean;
  public setGroups!: HasManySetAssociationsMixin<Group, string>;
  public readonly groups?: Group[];
  static associations: {
    projects: Association<User, Group>;
  };
};

export function userModelInitialization(sequelize: Sequelize): typeof User {
  User.init({
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    login: DataTypes.STRING,
    password: DataTypes.STRING(500),
    age: DataTypes.INTEGER,
    isDeleted: { type: DataTypes.BOOLEAN, field: 'is_deleted' }
  }, {
    sequelize,
    modelName: User.name,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['login']
      }
    ]
  });

  return User;
}

