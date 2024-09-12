import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email address is required' })
      .email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, { message: 'Password must be atleast 8 characters.' }),
  })
  .strict();

export const verifyAccountSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be exactly 6 digits.' }),
});
