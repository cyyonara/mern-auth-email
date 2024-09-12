import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1),
});

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be atleast 8 characters' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
});
