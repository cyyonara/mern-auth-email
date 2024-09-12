import { Schema, InferSchemaType, model } from 'mongoose';
import { Response } from 'express';
import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';
import generateOTP from '../utils/generateOTP';

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
  generateOTPTokenAndSetCookie: (otp: string, res: Response) => void;
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

userSchema.methods.generateOTPTokenAndSetCookie = function (otp: string, res: Response) {
  const hashedOTP = bcrypt.hashSync(otp, 10);
  const otpToken = jwt.sign(
    { userId: this._id, otpToken: hashedOTP },
    process.env.OTP_TOKEN_SECRET as string,
    {
      expiresIn: '5m',
    }
  );

  res.cookie('mern_otp_token', otpToken, {
    httpOnly: true,
    secure: nodeEnv === 'PROD',
    sameSite: nodeEnv === 'PROD' ? 'none' : 'lax',
    maxAge: 60_000 * 5,
  });
};

export default model<IUser>('user', userSchema);
