
import { CustomException } from './custom-exception';

export class AuthorizationException extends CustomException {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, AuthorizationException.prototype);
    }
}