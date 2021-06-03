import { Request, Response, NextFunction, Router } from 'express';
import { Op } from 'sequelize';
import Like from '../models/like.model';
import User from '../models/user.model';
import { isAuthenticated, RequestWithUser } from '../utils/auth';
import CRUD from '../utils/crud';

class LikeControllers extends CRUD {
  private dbName = Like;
  public router = Router();
  constructor() {
    super('Like');
    this.likePost = this.likePost.bind(this);
    this.numberOfLikes = this.numberOfLikes.bind(this);
    this.disLike = this.disLike.bind(this);
    this.startRouters();
  }
  private async startRouters() {
    this.router.use((req: Request, res: Response, next: NextFunction) => {
      this.assignRoutes(req, res, next);
      next();
    });

    this.router
      .route('/')
      .post(isAuthenticated, this.likePost)
      .get(this.numberOfLikes)
      .delete(isAuthenticated, this.disLike);
    // this.router.route('/likes').get(this.numberOfLikes);
  }

  public async likePost() {
    try {
      this.req.body.userId = (this.req as RequestWithUser).user!.id;
      const { postId, userId } = this.req.body;
      const like = await Like.findOne({ where: { postId, userId }, raw: true });
      if (!like) {
        const doc = await this.createOne();
        this.sendRes(doc, 201);
      } else this.sendRes('you liked this post before', 403);
    } catch (error) {
      this.next(error);
    }
  }
  public async disLike() {
    this.req.body.userId = (this.req as RequestWithUser).user!.id;
    const { postId, userId } = this.req.body;
    await this.deleteOne({ where: { postId, userId } });
  }
  public async numberOfLikes() {
    const likesCount = (await Like.findAndCountAll({})).count;
    this.sendRes(likesCount, 200);
  }
}

export default LikeControllers;
