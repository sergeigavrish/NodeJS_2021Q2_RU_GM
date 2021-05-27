export class NullReferenceException extends Error {
    constructor(id: string) {
        super(`Entity with id ${id} was not found`);
        Object.setPrototypeOf(this, NullReferenceException.prototype);
    }
}