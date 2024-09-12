import { z } from 'zod';
import { loginSchema, signUpSchema } from './lib/zod-validations';

interface ILoginData extends z.infer<typeof loginSchema> {}

interface ISignUpData extends z.infer<typeof signUpSchema> {}
