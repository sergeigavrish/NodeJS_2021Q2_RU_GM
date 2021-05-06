import express, { NextFunction, Request, Response } from 'express';
import { dbContext } from './db/db-context';
import { IResponse } from './shared/response/iresponse';
import { failResponseFactory } from './shared/response/responseFactory';
import { userRouter } from './user/user-router';

(async function () {
  const app = express()
  const port = 3000

  app.use(express.json());

  await dbContext.sequelize.sync();

  app.use('/users', userRouter);

  app.route('*').all((_: Request, res: Response<IResponse>) => {
    res.status(501).json(failResponseFactory([{ message: 'Not Implemented' }]));
  });

  app.use((err: Error, _: Request, res: Response<IResponse>, __: NextFunction) => {
    res.status(500).json(failResponseFactory([{ message: err.message }]));
  });

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  });
})();
