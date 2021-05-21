// import User from '../models/user.model';
// import { catchAsync } from '../src/utils/catchasync';

// export const isAuthenticated = catchAsync(async (req, res, next) => {
//   if (!req.session.isLoggedIn) {
//     return next(new Error('please login to your account.'));
//   }

//   const username = req.session.user.username;
//   const currentUser = User.findOne({ where: { username }, raw: true });
//   if (!currentUser) {
//     return next(new Error('user not found.'));
//   }
//   req.user = currentUser;
//   next();
// });
