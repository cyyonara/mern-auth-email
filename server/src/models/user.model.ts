import { Schema, InferSchemaType, model } from 'mongoose';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

interface IUser extends InferSchemaType<typeof userSchema> {
  generateTokenAndSetCookie: (res: Response) => void;
}

const nodeEnv = process.env.NODE_ENV;

userSchema.methods.generateTokenAndSetCookie = function (res: Response) {
  const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });

  res.cookie('mern_access_token', token, {
    httpOnly: true,
    secure: nodeEnv === 'PROD',
    sameSite: nodeEnv === 'PROD' ? 'none' : 'lax',
    maxAge: 60_000 * 60 * 24 * 30,
  });
};

export default model<IUser>('user', userSchema);
