import { NextFunction, Response } from 'express';
import { logger } from '../logger/bootstrap-logger';
import { CustomException } from '../shared/errors/custom-exception';
import { MethodException } from '../shared/errors/method-exception';
import { IValidatedReqBody } from '../shared/request/ivalidated-request';
import { IResponse } from '../shared/response/iresponse';
import { successResponseFactory } from '../shared/response/responseFactory';
import { Login } from '../user/interfaces/iuser';
import { UserController } from '../user/user-controller';
import { AuthService } from './auth-service';


export class AuthController {
    constructor(private service: AuthService) { }

    async login(req: IValidatedReqBody<Login>, res: Response<IResponse<string>>, next: NextFunction) {
        try {
            const { login, password } = req.body;
            const jwt = await this.service.login(login, password);
            const response = successResponseFactory(jwt);
            return res.json(response);
        } catch (error) {
            error = this.handleError(error, this.login.name, req.params, req.query);
            return next(error);
        }
    }

    private handleError<T, U>(error: Error | CustomException, method: string, params: T, query: U): Error {
        if (!(error instanceof CustomException)) {
            error = new MethodException(error.message, method, params, query);
            logger.error({ message: error.message, label: UserController.name })
        }
        return error;
    }
}
