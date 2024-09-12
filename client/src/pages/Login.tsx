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
import { loginSchema } from '@/lib/zod-validations';
import { ILoginData } from '@/types';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginData>({ resolver: zodResolver(loginSchema) });

  const handleLogin: SubmitHandler<ILoginData> = (formData) => {};

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='flex-1 max-w-[400px]'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcome back to the app</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col gap-y-4'>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div>
                <Input
                  id='email'
                  type='text'
                  placeholder='m@example.com'
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-xs mt-[2px] text-red-500'>{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className='flex flex-col gap-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' {...register('password')} />
            </div>
            <Button type='submit' className='mt-3'>
              Login
            </Button>
            <p className='text-center text-sm'>
              Don't have an account?{' '}
              <Link to='/sign-up' className='font-semibold hover:underline text-primary'>
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
