import { Request, Response, NextFunction, Router } from 'express';
import Post from '../models/post.model';
import { isAuthenticated, RequestWithUser } from '../utils/auth';
import CRUD from '../utils/crud';

class PostControllers extends CRUD {
  public router = Router();
  private dbName = Post;
  constructor() {
    super('Post');
    this.createPost = this.createPost.bind(this);
    this.getPost = this.getPost.bind(this);
    this.getAll = this.getAll.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.startRouters();
  }
  private async startRouters() {
    this.router.use((req: Request, res: Response, next: NextFunction) => {
      this.assignRoutes(req, res, next);
      next();
    });

    this.router
      .route('/')
      .get(this.getAll)
      .post(isAuthenticated, this.createPost);

    this.router
      .route('/:id')
      .get(this.getPost)
      .patch(this.updatePost)
      .delete(this.deletePost);
  }
  public async createPost() {
    try {
      this.req.body.authorId = (this.req as RequestWithUser).user!.id;
      const doc = (await this.createOne()) as Post;
      await this.sendRes(doc, 201);
    } catch (error) {
      return this.next(error);
    }
  }

  public async getPost() {
    await this.getOne();
  }

  public async getAll() {
    await this.getMany();
  }

  public async updatePost() {
    await this.update({ where: { id: this.req.params.id } });
  }

  public async deletePost() {
    await this.deleteOne({ where: { id: this.req.params.id } });
  }
}

export default PostControllers;
