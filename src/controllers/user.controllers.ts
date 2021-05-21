// import User from '../models/user.model';
import CRUD from '../utils/crud';
import { Request, Response, NextFunction, Router } from 'express';
import Auth from '../utils/auth';
import User from '../models/user.model';
import { Model } from 'sequelize/types';
import { UserI } from '../models/user';
import { compare } from 'bcryptjs';

export default class UserController extends CRUD {
  private UserModel = User;
  public router = Router();
  private basePath = '/users';
  constructor() {
    super('User');
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
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
    this.router.route('/').post(this.signup).get(this.getAllUsers);
    this.router.route('/login').post(this.login);
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
      const token = new Auth().createToken(doc.id);
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
      const token = new Auth().createToken(doc.id);
      await this.sendRes({ ...doc, token }, 200);
    } catch (error) {
      this.next(error);
    }
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
}

// export const login = catchAsync(async (req, res, next) => {
//   let user = await User.findOne({
//     where: { username: req.body.username },
//   });

//   if (!user.toJSON()) {
//     return next(new Error('user not found'));
//   }
//   if (!(await user.comparePassword(req.body.password))) {
//     return next(new Error('incorrect password.'));
//   }
//   user = user.toJSON();
//   delete user.password;

//   res.json({ data: user });
// });

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
