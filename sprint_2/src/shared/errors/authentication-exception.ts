
import { CustomException } from './custom-exception';

export class AuthenticationException extends CustomException {
    constructor() {
        super('Wrong password');
        Object.setPrototypeOf(this, AuthenticationException.prototype);
    }
}