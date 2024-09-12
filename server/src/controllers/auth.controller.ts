import User from '../models/user.model';
import { Request, Response } from 'express';
import { IRequest, OtpTokenPayload } from '../types';
import expressAsyncHandler from 'express-async-handler';
import { signUpSchema, verifyAccountSchema } from '../lib/zod-validations';
import bcrypt from 'bcrypt';
import generateOTP from '../utils/generateOTP';
import sendOtpToEmail from '../nodemailer/sendOtpToEmail';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import jwt from 'jsonwebtoken';

class AuthController {
  public static signUp() {
    return expressAsyncHandler(async (req: Request, res: Response) => {
      const { email, password } = signUpSchema.parse(req.body);
      const user = await User.findOne({ email });

      if (user) {
        res.status(400);
        throw new Error('Email address already in use.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword });
      const otp = generateOTP();

      await sendOtpToEmail(otp, email);

      newUser.generateTokenAndSetCookie(res);
      newUser.generateOTPTokenAndSetCookie(otp, res);

      res.status(201).json({
        success: true,
        data: {
          userId: newUser._id,
          email: newUser.email,
          isVerified: newUser.isVerified,
        },
        message: 'User successfully created.',
        statusCode: 201,
      });
    });
  }

  public static verifyAccount() {
    return expressAsyncHandler(async (req: IRequest, res: Response) => {
      try {
        const { otp } = verifyAccountSchema.parse(req.body);
        const otpVerificationToken = req.cookies.mern_otp_token;

        const { userId, otpToken } = jwt.verify(
          otpVerificationToken,
          process.env.OTP_TOKEN_SECRET as string
        ) as OtpTokenPayload;

        const currentUserId = req.user._id;
      } catch (err: any) {
        let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

        if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
          res.status(401).clearCookie('mern_otp_token').json({
            success: false,
            isOtpExpired: true,
            message: 'OTP is expired.',
            statusCode: 401,
          });
          return;
        }

        if (err instanceof ZodError) {
          res.status(400);
          throw new Error(fromZodError(err).toString());
        }

        res.status(statusCode);
        throw new Error(
          process.env.NODE_ENV === 'PROD' ? err.message : err.stack.toString()
        );
      }
    });
  }
}

export default AuthController;
