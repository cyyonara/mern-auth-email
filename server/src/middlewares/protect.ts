import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import { ITokenPayload } from '../types';
import { IRequest } from '../types';
import { Response, NextFunction } from 'express';
import User from '../models/user.model';

class Protect {
  public static protectMiddleware() {
    return expressAsyncHandler(
      async (req: IRequest, res: Response, next: NextFunction) => {
        if (req.cookies.mern_access_token) {
          const accessToken = req.cookies.mern_access_token;
          const { userId } = jwt.verify(
            accessToken,
            process.env.JWT_SECRET as string
          ) as ITokenPayload;

          const user = await User.findById(userId);

          if (!user) {
            res.clearCookie('mern_access_token').status(401);
            throw new Error('Unauthorized user.');
          }

          req.user = user;
          next();
        } else {
          res.status(401);
          throw new Error('Token is required.');
        }
      }
    );
  }
}

export default Protect;
