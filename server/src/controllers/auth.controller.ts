import User from '../models/user.model';
import { Request, Response } from 'express';
import { IRequest } from '../types';
import expressAsyncHandler from 'express-async-handler';
import { signUpSchema, verifyAccountSchema } from '../lib/zod-validations';
import bcrypt from 'bcrypt';
import generateOTP from '../utils/generateOTP';
import sendOtpToEmail from '../nodemailer/sendOtpToEmail';
import { redisClient } from '../config/redis';

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
      const hashedOtp = await bcrypt.hash(otp, 10);

      await redisClient.setEx(`otp-${newUser._id}`, 60 * 5, hashedOtp);
      await sendOtpToEmail(otp, email);

      newUser.generateTokenAndSetCookie(res);

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
      const currentUserId = req.user._id.toString();
      const hashedOtp = await redisClient.get(`otp-${currentUserId}`);

      if (!hashedOtp) {
        res.status(401);
        throw new Error('OTP code is expired.');
      }

      const { otp } = verifyAccountSchema.parse(req.body);
      const isOtpMatch = await bcrypt.compare(otp, hashedOtp);

      if (!isOtpMatch) {
        res.status(401);
        throw new Error('Invalid OTP code.');
      }

      const verifiedUser = await User.findByIdAndUpdate(
        currentUserId,
        { $set: { isVerified: true } },
        { new: true }
      );

      await redisClient.del(`otp-${currentUserId}`);

      res.status(200).json({
        success: true,
        data: {
          userId: verifiedUser!._id,
          email: verifiedUser!.email,
          isVerified: verifiedUser!.isVerified,
        },
        message: 'User has been successfully verified.',
        statusCode: 200,
      });
    });
  }
}

export default AuthController;
