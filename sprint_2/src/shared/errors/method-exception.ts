import { formatString } from '../../utils/format-string';
import { CustomException } from './custom-exception';

export class MethodException extends CustomException {
    constructor(message: string, method: string, params: any, query?: any) {
        let str = `Method: %s; Params: %s;`;
        let formatedMessage = '';
        if (query) {
            str += ' Query: %s;';
            formatedMessage = formatString(str, method, params, query, message);
        } else {
            formatedMessage = formatString(str, method, params, message);
        }
        super(formatedMessage, message);
        Object.setPrototypeOf(this, MethodException.prototype);
    }
}