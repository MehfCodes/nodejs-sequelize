import Comment from '../models/comment.model';
import CRUD from '../utils/crud';
import { Request, Response, NextFunction, Router } from 'express';
import { isAuthenticated, RequestWithUser } from '../utils/auth';

class CommentControllers extends CRUD {
  private dbName = Comment;
  public router = Router();
  constructor() {
    super('Comment');
    this.createComment = this.createComment.bind(this);
    this.startRouters();
  }
  private async startRouters() {
    this.router.use((req: Request, res: Response, next: NextFunction) => {
      this.assignRoutes(req, res, next);
      next();
    });

    this.router.route('/').post(isAuthenticated, this.createComment);
  }

  public async createComment() {
    this.req.body.userId = (this.req as RequestWithUser).user!.id;
    const doc = await this.createOne();
    // console.log(doc);

    this.sendRes(doc, 201);
  }
}

export default CommentControllers;
