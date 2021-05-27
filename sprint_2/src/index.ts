import express, { NextFunction, Request, Response } from 'express';
import { dbContext } from './db/db-context';
import { groupRouter } from './group/group-router';
import { bootstrapLogger, logger } from './logger/bootstrap-logger';
import { CustomException } from './shared/errors/custom-exception';
import { IResponse } from './shared/response/iresponse';
import { failResponseFactory } from './shared/response/responseFactory';
import { userRouter } from './user/user-router';

const LABEL = 'APP';

(async function () {
  bootstrapLogger();

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

  app.use('/users', userRouter);
  app.use('/groups', groupRouter);

  app.route('*').all((req: Request, res: Response<IResponse>) => {
    const message = 'Not Implemented';
    logger.error({ message, label: LABEL }, req.path, req.method);
    const response = failResponseFactory([{ message }]);
    res.status(501).json(response);
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
    res.status(500).json(response);
  });

  app.listen(port, () => {
    const message = `App listening at http://localhost:${port}`;
    logger.debug({ message, label: LABEL });
    console.log(message);
  });
})();
