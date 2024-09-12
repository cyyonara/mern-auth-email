import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HydratedDocument } from 'mongoose';

interface IRequest extends Request {
  user?: HydratedDocument<{
    _id: Types.ObjectId;
    email: string;
    password: string;
    isVerified: boolean;
  }>;
}

interface ITokenPayload extends JwtPayload {
  userId: string;
}
