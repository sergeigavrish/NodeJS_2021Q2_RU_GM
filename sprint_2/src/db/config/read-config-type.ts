import { ConfigTypes } from './ConfigTypes';

export function readConfigType(type: string = ConfigTypes.development): ConfigTypes {
    switch (type) {
        case ConfigTypes.production:
            return ConfigTypes.production;
        case ConfigTypes.test:
            return ConfigTypes.test;
        case ConfigTypes.development:
        default:
            return ConfigTypes.development;
    }
}