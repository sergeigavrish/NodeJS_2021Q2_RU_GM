'use strict';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { IUser } from '../interfaces/iuser';

export class User extends Model<IUser> implements IUser {
  id!: string;
  login!: string;
  password!: string;
  age!: number;
  isDeleted!: boolean;
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
    timestamps: false
  });

  return User;
}

