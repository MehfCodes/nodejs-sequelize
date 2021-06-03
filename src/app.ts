import express, { Application, Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { config } from 'dotenv';
import db from './configs/dbConnection';
// import userRouters from './routers/user.routers';
import cookieParser from 'cookie-parser';
import PostControllers from './controllers/post.controllers';
import LikeControllers from './controllers/like.controllers';
import UserControllers from './controllers/user.controllers';
// import User from './models/user.model';
config({ path: './config.env' });

class App {
  private app: Application;
  private port: number;
  constructor() {
    this.app = express();
    this.port = this.setPort();
    this.connectDB();
    this.middlewares();
    this.routers();
    this.catchErrors();
    this.startServer();
  }

  private async connectDB(): Promise<void> {
    try {
      await db.sync();
      await db.authenticate();
      await db.query('create database if not exists coffee_store');
      console.log('database connected...');
    } catch (error) {
      console.log(error);
    }
  }
  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private routers(): void {
    this.app.use('/api/users', new UserControllers().router);
    this.app.use('/api/posts', new PostControllers().router);
    this.app.use('/api/likes', new LikeControllers().router);
  }
  private catchErrors(): void {
    this.app.use(
      (error: Error, _req: Request, res: Response, _next: NextFunction) => {
        res.json({ message: error.message, error });
      }
    );
  }
  private setPort(): number {
    if (process.env.NODE_ENV === 'development') {
      return Number(process.env.DEV_PORT);
    } else if (process.env.NODE_ENV === 'test') {
      return Number(process.env.TEST_PORT);
    } else {
      return Number(process.env.PRODUCTION_PORT);
    }
  }
  protected startServer(): Server {
    const server = this.app.listen(this.port);
    process.stdout.write(`server started on ${this.port} ...`);
    return server;
  }
}

new App();
