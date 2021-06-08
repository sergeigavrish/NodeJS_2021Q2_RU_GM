
import { CustomException } from './custom-exception';

export class AuthenticationException extends CustomException {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, AuthenticationException.prototype);
    }
}