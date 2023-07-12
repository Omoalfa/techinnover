import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { NODE_ENV, PORT, LOG_FORMAT, TEST_PORT } from '@Config';
import { Routes } from '@Interfaces/router';
import fileUpload from "express-fileupload";
import { logger, stream } from '@Logger/index';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = this.env === "test" ? TEST_PORT : PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      limits: {
        fileSize: 5 * 1024 * 1024
      }
    }))
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use(`/api/v1${route.path}`, route.router);
    });
  }
}

export default App;