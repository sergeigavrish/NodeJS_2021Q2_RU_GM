import express, {Request, Response} from 'express';

(function () {
  const app = express()
  const port = 3000

  app.use(express.json());

  app.use((error: Error, _: Request, res: Response) => {
    console.error(error.message);
    res.sendStatus(500);
  });

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  });
})();