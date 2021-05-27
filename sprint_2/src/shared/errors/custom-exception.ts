export class CustomException extends Error {
    constructor(message: string, protected originMessage: string = message) {
        super(message);
        Object.setPrototypeOf(this, CustomException.prototype);
    }

    public getOriginMessage(): string {
        return this.originMessage;
    }
}