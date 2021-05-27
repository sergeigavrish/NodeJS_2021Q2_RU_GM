export interface IRepository<T, L = any> {
    read(options?: L): Promise<T[]>;
    readById(id: string): Promise<T | null>;
    create(user: T): Promise<T>;
    update(user: T): Promise<T>;
    delete(id: string): Promise<boolean>;
}
