import express, {NextFunction, Request, Response} from 'express';
import { userRouter } from './user/user-router';

(function () {
  const app = express()
  const port = 3000

  app.use(express.json());

  app.use('/users', userRouter);

  app.route('*').all((_: Request, res: Response) => {
    res.sendStatus(501);
  });

  app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
    console.error(err.message);
    res.sendStatus(500);
  });

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  });
})();
