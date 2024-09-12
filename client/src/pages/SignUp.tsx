import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/lib/zod-validations';
import { ISignUpData } from '@/types';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signUpSchema),
  });

  const handleSignUp: SubmitHandler<ISignUpData> = (formData) => {};

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='flex-1 max-w-[400px]'>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='flex flex-col gap-y-4' onSubmit={handleSubmit(handleSignUp)}>
            <div className='flex flex-col gap-y-2'>
              <Label
                htmlFor='email'
                className="after:content-['*'] after:text-red-400 after:ml-[3px]"
              >
                Email
              </Label>
              <div>
                <Input id='email' type='text' placeholder='Enter your email address' />
                {errors.email && (
                  <p className='text-xs mt-[2px] text-red-500'>{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label
                htmlFor='password'
                className="after:content-['*'] after:text-red-400 after:ml-[3px]"
              >
                Password
              </Label>
              <div>
                <Input id='password' type='password' placeholder='+8 characters' />
                {errors.password && (
                  <p className='text-xs mt-[2px] text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label
                htmlFor='confirm-password'
                className="after:content-['*'] after:text-red-400 after:ml-[3px]"
              >
                Confirm password
              </Label>
              <div>
                <Input
                  id='confirm-password'
                  type='password'
                  placeholder='Confirm your password'
                />
                {errors.confirmPassword && (
                  <p className='text-xs mt-[2px] text-red-500'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <Button type='submit' className='mt-3'>
              Create account
            </Button>
            <p className='text-center text-sm'>
              Already have an account?{' '}
              <Link to='/' className='font-semibold hover:underline text-primary'>
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
