import { Request, Response, NextFunction } from 'express';
import {
  DestroyOptions,
  FindOptions,
  Model,
  ModelCtor,
  NonNullFindOptions,
  UpdateOptions,
} from 'sequelize';
import db from '../configs/dbConnection';
import User from '../models/user.model';

export default class CRUD {
  // protected doc!: Model<any, any> | {} | null;
  private model: ModelCtor<Model<any, any>>;
  protected req!: Request;
  protected res!: Response;
  protected next!: NextFunction;
  constructor(private modelName: string) {
    this.model = db.models[modelName];
    this.createOne = this.createOne.bind(this);
    this.getOne = this.getOne.bind(this);
    this.getMany = this.getMany.bind(this);
    this.update = this.update.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  protected assignRoutes(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
  protected async sendRes(
    doc: any,
    statusCode: number
  ): Promise<Response<any, Record<string, any>> | undefined> {
    return this.res.status(statusCode).json({ data: doc });
  }

  protected async createOne(): Promise<any> {
    try {
      const doc = (await this.model.create(this.req.body)).toJSON();
      if (!doc) {
        return this.next(new Error('failed!'));
      }
      return doc;
    } catch (error) {
      return this.next(error);
    }
  }

  protected async getOne(options?: FindOptions<any>): Promise<void | object> {
    try {
      const doc = await this.model.findOne(options);
      if (!doc) {
        return this.next(new Error('not found'));
      }
      if (this.model === User) {
        return doc;
      }
      await this.sendRes(doc, 200);
    } catch (error) {
      return this.next(error);
    }
  }
  protected async getMany(options?: FindOptions<any>): Promise<void> {
    try {
      const docs = await this.model.findAll(options);
      if (docs.length === 0) {
        return this.next(new Error('not found'));
      }

      this.sendRes(docs, 200);
    } catch (error) {
      return this.next(error);
    }
  }
  protected async update(options: UpdateOptions<any>): Promise<void> {
    try {
      const docs = await this.model.update(this.req.body, options);
      if (docs[0] === 0) {
        return this.next(new Error('update failed!'));
      }

      this.sendRes(docs, 200);
    } catch (error) {
      this.next(error);
    }
  }
  protected async deleteOne(options: DestroyOptions): Promise<void> {
    const doc = await this.model.destroy(options);
    if (doc == 0) {
      return this.next(new Error('delete failed!'));
    }
    this.sendRes(doc, 200);
  }
  protected catchAsync(fn: any) {
    return fn().catch(this.next);
  }
}
