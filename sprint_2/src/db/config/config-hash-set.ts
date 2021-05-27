import { Options } from 'sequelize'
import { ConfigTypes } from './ConfigTypes'
import * as configFile from './config.json';

export const configHashSet: { [key in ConfigTypes]: Options } = {
  //@ts-ignore
  development: configFile[ConfigTypes.development],
  //@ts-ignore
  test: configFile[ConfigTypes.test],
  //@ts-ignore
  production: configFile[ConfigTypes.production]
}
