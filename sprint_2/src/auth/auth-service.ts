import { sign } from 'jsonwebtoken';
import { logger } from '../logger/bootstrap-logger';
import { hashSaltFactory } from '../shared/auth/hashSaltFactory';
import { AuthenticationException } from '../shared/errors/authentication-exception';
import { CustomException } from '../shared/errors/custom-exception';
import { MethodException } from '../shared/errors/method-exception';
import { IUser } from '../user/interfaces/iuser';
import { IUserQuery } from '../user/interfaces/iuser-query';
import { IUserRepository } from '../user/repositories/iuser-repository';

export class AuthService {
    constructor(
        private repository: IUserRepository<IUser, Partial<IUserQuery>>
    ) { }

    async login(login: string, password: string): Promise<string> {
        try {
            const userList = await this.repository.read({ login });
            const user = userList[0];
            if (!user) {
                throw new AuthenticationException(`User with login ${login} was not found`);
            }
            const [hash, salt] = user.password.split(' ');
            const [newHash] = hashSaltFactory(password, salt).split(' ');
            if (hash !== newHash) {
                throw new AuthenticationException('wrong password');
            }
            const jwt = sign({ login }, process.env.TOKEN_SECRET ?? '', { expiresIn: '24h' });
            return jwt;
        } catch (error) {
            if (!(error instanceof CustomException)) {
                error = new MethodException(error.message, this.login.name, login);
                logger.error({ message: error.message, label: AuthService.name });
            }
            throw error;
        }
    }
}
