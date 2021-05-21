import { Request, NextFunction } from 'express';
import { verify, sign, VerifyErrors, JsonWebTokenError } from 'jsonwebtoken';
import { UserAttributes } from '../models/user';
import User from '../models/user.model';

interface Payload {
  id: number;
  iat: number;
}

export default class Auth {
  private secret = String(process.env.TOKEN_KEY);
  // private currentUser:UserAttributes|null;
  // private id:number;

  // constructor(public req: Request, public next: NextFunction) {}

  // private getToken(): string | undefined {
  //   if (
  //     this.req.headers.authorization &&
  //     this.req.headers.authorization.startsWith('Bearer')
  //   ) {
  //     return this.req.headers.authorization.split(' ')[1];
  //   } else if (this.req.cookies && this.req.cookies.jwt) {
  //     return this.req.cookies.jwt;
  //   } else {
  //     return undefined;
  //   }
  // }

  //   private async isUserExists(){
  //     let token=this.getToken()
  //     if(!token){
  //       return this.next(
  //         new Error('You are not logged in! Please log in to get access.')
  //       );
  //     }
  //     const decoded=await this.verifyToken(token)

  // this.currentUser=await User.findOne({where:{id:decoded.id}})
  //   }

  public createToken(id: number) {
    return sign({ id }, this.secret, { expiresIn: '3d' });
  }

  // public verifyToken(
  //   token: string
  // ): Promise<Payload | VerifyErrors> {
  //   return new Promise((resolve, reject) => {
  //     verify(
  //       token,
  //       this.secret,
  //       (error: VerifyErrors | null, decoded: object | undefined) => {
  //         if (error) return reject(error);
  //         return resolve(decoded);
  //       }
  //     );
  //   });
  // }
}
