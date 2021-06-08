import { dbContext } from "../db/db-context";
import { logger } from "../logger/bootstrap-logger";

type HandlerFunction = (error: Error, propertyKey: string, ...args: any[]) => any;

export function TryCatch(handler: HandlerFunction) {
    return <
        T extends Object,
        K extends keyof T & string
    >(
        target: T,
        propertyKey: K,
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
    ) => {
        if (typeof descriptor.value === 'function') {
            const originalMethod = descriptor.value;
            descriptor.value = (...args: any[]) => {
                try {
                    const result = originalMethod.apply(target, args);
                    if (result instanceof Promise) {
                        return result.catch((error: Error) => {
                            handler.call(target, error, propertyKey, ...args);
                        });
                    }
                    return result;
                } catch (error) {
                    handler.call(target, error, propertyKey, ...args);
                }
            }
        }
        return descriptor;
    }
}

export function LogError(label?: string) {
    return <
        T extends Object,
        K extends keyof T & string
    >(
        target: T,
        _: K,
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
    ) => {
        if (typeof descriptor.value === 'function') {
            const originalMethod = descriptor.value;
            label = label || target.constructor.name;
            descriptor.value = (...args: any[]) => {
                try {
                    const result = originalMethod.apply(target, args);
                    if (result instanceof Promise) {
                        return result.catch((error: Error) => {
                            logger.error({ message: error.message, label });
                            throw error;
                        });
                    }
                    return result;
                } catch (error) {
                    logger.error({ message: error.message, label });
                    throw error;
                }
            }
        }
        return descriptor;
    }
}

export function Transactional() {
    return <
        T extends Object,
        K extends keyof T & string
    >(
        target: T,
        _: K,
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
    ) => {
        if (typeof descriptor.value === 'function') {
            const originalMethod = descriptor.value;
            descriptor.value = async (...args: any[]) => {
                const transaction = await dbContext.sequelize.transaction();
                try {
                    const result = await originalMethod.call(target, ...args, transaction);
                    transaction.commit();
                    return result;
                } catch (error) {
                    transaction.rollback();
                    throw error;
                }
            }
        }
        return descriptor;
    }
}