import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import jsonwebtoken, { JsonWebTokenError } from 'jsonwebtoken';
import { dbContext } from './db/db-context';
import { groupRouter } from './group/group-router';
import { bootstrapLogger, logger } from './logger/bootstrap-logger';
import { CustomException } from './shared/errors/custom-exception';
import { IResponse } from './shared/response/iresponse';
import { failResponseFactory, successResponseFactory } from './shared/response/responseFactory';
import { userRouter } from './user/user-router';
import { IValidatedReqBody } from './shared/request/ivalidated-request';
import { Login } from './user/interfaces/iuser';
import { User } from './user/models/user';
import { hashSaltFactory } from './shared/auth/hashSaltFactory';
import { AuthenticationException } from './shared/errors/authentication-exception';
import { AuthorizationException } from './shared/errors/authorization-exception';

const LABEL = 'APP';

(async function () {
  bootstrapLogger();

  dotenv.config();

  process.on('uncaughtException', (error: Error) => {
    logger.error({ message: error.message, label: LABEL });
    process.exit(1);
  });

  process.on('unhandledRejection', (error: Error) => {
    logger.error({ message: error.message, label: LABEL });
    process.exit(1);
  });

  const app = express()
  const port = 3000;

  app.use(express.json());

  await dbContext.sequelize.sync();

  app.use((req: Request, _: Response<IResponse>, next: NextFunction) => {
    logger.debug({ message: `${req.path} ${req.method} params %s query %s`, label: LABEL }, req.params, req.query);
    next();
  });

  app.post('/login', async (req: IValidatedReqBody<Login>, res: Response<IResponse<string>>, _: NextFunction) => {
    try {
      const { login, password } = req.body;
      const user = await User.findOne({ where: { login } })
      if (!user) {
        const response = failResponseFactory([{ message: `No such user with login: ${login}` }]);
        // @ts-ignore
        return res.status(404).json(response);
      }
      const [hash, salt] = user.password.split(' ');
      const [newHash] = hashSaltFactory(password, salt).split(' ');
      if (hash !== newHash) {
        const response = failResponseFactory([{ message: `Wrong password` }]);
        // @ts-ignore
        return res.status(404).json(response);
      }
      const jwt = jsonwebtoken.sign({ login }, process.env.TOKEN_SECRET ?? '', { expiresIn: '24h' });
      const response = successResponseFactory<string>(jwt);
      return res.json(response);
    } catch (error) {
      // @ts-ignore
      return res.status(404).json(failResponseFactory([{ message: '' }]));
    }
  });

  app.use((req: IValidatedReqBody<Login>, _: Response, next: NextFunction) => {
    try {
      const authHeader: string = req.headers['authorization'];
      if (!authHeader) {
        throw new AuthorizationException('');
      }
      const token = authHeader.split(' ')[1]
      if (!token) {
        throw new AuthorizationException('');
      }
      const user = jsonwebtoken.verify(token, process.env.TOKEN_SECRET ?? '');
      // @ts-ignore
      req.user = user;
      return next()
    } catch (error) {
      return next(error);
    }
  })

  app.use('/users', userRouter);
  app.use('/groups', groupRouter);

  app.route('*').all((req: Request, res: Response<IResponse>) => {
    const message = 'Not Implemented';
    logger.error({ message, label: LABEL }, req.path, req.method);
    const response = failResponseFactory([{ message }]);
    res.status(501).json(response);
  });

  app.use((err: Error, _: Request, res: Response<IResponse>, next: NextFunction) => {
    if (err instanceof AuthenticationException) {
      logger.error({ message: err.message, label: LABEL });
      const response = failResponseFactory([{ message: err.message }]);
      return res.status(401).json(response);
    }
    if (err instanceof AuthorizationException) {
      logger.error({ message: err.message, label: LABEL });
      const response = failResponseFactory([{ message: err.message }]);
      return res.status(401).json(response);
    }
    if (err instanceof JsonWebTokenError) {
      logger.error({ message: err.message, label: LABEL });
      const response = failResponseFactory([{ message: err.message }]);
      return res.status(403).json(response);
    }
    return next(err);
  });

  app.use((err: Error, _: Request, res: Response<IResponse>, __: NextFunction) => {
    let message: string;
    if (!(err instanceof CustomException)) {
      logger.error({ message: err.message, label: LABEL });
      message = err.message;
    } else {
      message = err.getOriginMessage();
    }
    const response = failResponseFactory([{ message: message }]);
    return res.status(500).json(response);
  });

  app.listen(port, () => {
    const message = `App listening at http://localhost:${port}`;
    logger.debug({ message, label: LABEL });
    console.log(message);
  });
})();
