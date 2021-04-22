import User from '../models/user.model.js';
import { catchAsync } from '../utils/catchasync.js';

export const signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  if (!user.toJSON()) {
    return next(new Error('signup failed.'));
  }
  res.json({ data: user.toJSON() });
});

export const getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: ['id', 'username', 'email'],
    raw: true,
  });
  // console.log('users', users);

  if (users.length === 0) {
    return next(new Error('not found.'));
  }
  res.json({ data: users });
});

export const updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(new Error('you can not update password directly.'));
  }
  const users = await User.update(req.body, {
    where: { id: req.params.id },
    returning: true,
    individualHooks: true,
  });

  if (users[1] === 0) {
    return next(new Error('not found.'));
  }
  res.json({ data: 'user updated.' });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const users = await User.destroy({
    where: { id: req.params.id },
  });
  //   console.log('users', users);

  if (users[1] === 0) {
    return next(new Error('not found.'));
  }
  res.json({ data: 'user deleted.' });
});
