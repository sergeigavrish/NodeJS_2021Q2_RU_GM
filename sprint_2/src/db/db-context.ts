import { Sequelize } from 'sequelize';

import { User, userModelInitialization } from '../user/models/user';
import { Group, groupModelInitialization } from '../group/models/group';

export interface DbContext {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  User: typeof User;
  Group: typeof Group;
}

export const dbContext = {} as DbContext;

export async function initDb() {
  let sequelize: Sequelize;
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  });

  const userModel = userModelInitialization(sequelize);
  const groupModel = groupModelInitialization(sequelize);
  User.belongsToMany(Group, { through: 'UserGroup', foreignKey: 'user_id', timestamps: false, hooks: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  Group.belongsToMany(User, { through: 'UserGroup', foreignKey: 'group_id', timestamps: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' });

  dbContext.User = userModel;
  dbContext.Group = groupModel;
  dbContext.sequelize = sequelize;
  dbContext.Sequelize = Sequelize;

  await dbContext.sequelize.sync();
}
