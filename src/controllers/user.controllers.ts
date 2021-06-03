import CRUD from '../utils/crud';
import { Request, Response, NextFunction, Router } from 'express';

import { compare } from 'bcryptjs';
import User from '../models/user.model';
import { createToken, isAuthenticated } from '../utils/auth';

export default class UserControllers extends CRUD {
  public router = Router();

  constructor() {
    super('User');
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.startRouters();
  }
  private async startRouters() {
    this.router.use((req: Request, res: Response, next: NextFunction) => {
      this.assignRoutes(req, res, next);
      next();
    });

    this.router
      .route('/')
      .post(this.signup)
      .get(isAuthenticated, this.getAllUsers);
    this.router.route('/login').post(this.login);
    this.router.route('/logout').delete(this.logout);
    this.router
      .route('/:id')
      .get(this.getOne)
      .patch(this.updateUser)
      .delete(this.deleteUser);
  }

  public async signup() {
    try {
      const doc = await this.createOne();
      if (doc.hasOwnProperty('password')) {
        doc.password = undefined;
      }
      const token = createToken(doc.id);
      this.setTokenInCookie(token);
      await this.sendRes({ ...doc, token }, 201);
    } catch (error) {
      return this.next(error);
    }
  }

  public async login() {
    try {
      const doc = (await this.getOne({
        where: { username: this.req.body.username },
        raw: true,
      })) as User;

      if (!(await compare(this.req.body.password, doc.password!))) {
        return this.next(new Error('incorrect password.'));
      }
      doc.password = undefined;
      const token = createToken(doc.id);
      this.setTokenInCookie(token);
      await this.sendRes({ ...doc, token }, 200);
    } catch (error) {
      this.next(error);
    }
  }
  public async logout() {
    this.res.cookie('jwt', 'loggedout', { expires: new Date(-1) });
    this.sendRes('logged out', 200);
  }
  public async getAllUsers() {
    await this.getMany({ attributes: { exclude: ['password'] } });
  }

  public async updateUser() {
    try {
      if (this.req.body.password) {
        return this.next(new Error('you can not update password directly.'));
      }
      await this.update({
        where: { id: this.req.params.id },
      });
    } catch (error) {
      this.next(error);
    }
  }

  public async deleteUser() {
    await this.deleteOne({ where: { id: this.req.params.id } });
  }

  private setTokenInCookie(token: string) {
    this.res.cookie('jwt', token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
  }
}

// export const changePassword = catchAsync(async (req, res, next) => {
//   const { oldPassword, password } = req.body;
//   const user = await User.findOne({ where: { id: req.user.id }, raw: true });
//   if (!user) {
//     return next(new Error('user not found'));
//   }
//   if (!(await user.comparePassword(oldPassword))) {
//     return next(new Error('old password is incorrect.'));
//   }
//   user.password = password;
//   await user.validate();
//   await user.save();
//   res.json({ data: 'password changed.' });
// });
