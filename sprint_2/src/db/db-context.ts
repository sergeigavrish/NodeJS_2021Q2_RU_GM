'use strict';

import { Sequelize, Options } from 'sequelize';

import { User, userModelInitialization } from '../user/models/user';
import { configHashSet } from './config/config-hash-set';
import { ConfigTypes } from './config/ConfigTypes';
import { readConfigType } from './config/read-config-type';

const env: ConfigTypes = readConfigType(process.env.NODE_ENV);
const config: Options = configHashSet[env];

export interface DbContext {
  sequelize: Sequelize;
  Sequelize: Sequelize;
  User: User;
}

export const dbContext: { [key: string]: any } = {};

let sequelize: Sequelize;
if (config.hasOwnProperty('use_env_variable')) {
  const envVariableName: string = (config as any)['use_env_variable'] as string;
  sequelize = new Sequelize(process.env[envVariableName] as string, config);
} else {
  sequelize = new Sequelize(config.database as string, config.username as string, config.password, config);
}

[
  userModelInitialization,
].forEach(modelInit => {
  const model = modelInit(sequelize);
  dbContext[model.name] = model;
});

Object.keys(dbContext).forEach(modelName => {
  if (dbContext[modelName].associate) {
    dbContext[modelName].associate(dbContext);
  }
});

dbContext.sequelize = sequelize;
dbContext.Sequelize = Sequelize;
