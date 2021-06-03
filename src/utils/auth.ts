import { verify, sign, VerifyErrors } from 'jsonwebtoken';
import User from '../models/user.model';

import { Request, Response, NextFunction } from 'express';

interface Payload {
  id: number;
  iat: number;
}
export interface RequestWithUser extends Request {
  user?: User | null;
}
const secret = String(process.env.TOKEN_KEY);

export function createToken(id: number) {
  return sign({ id }, secret, { expiresIn: '3d' });
}

async function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    verify(token, secret, (error: VerifyErrors | null, decoded?: object) => {
      if (error) return reject(error);
      return resolve(decoded);
    });
  });
}

export async function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<Error | void> {
  try {
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(new Error('please login to your account.'));
    }
    const decoded = (await verifyToken(token)) as Payload;
    const currentUser = await User.findOne({
      where: { id: decoded.id },
      raw: true,
    });
    if (!currentUser) {
      return next(new Error('user not found'));
    }

    // check for change password
    (req as RequestWithUser).user = currentUser;
    next();
  } catch (error) {
    return next(error);
  }
}
