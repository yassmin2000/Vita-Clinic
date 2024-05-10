'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { useAuthStore } from '@/hooks/useAuthStore';

const formSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email().min(1, {
    message: 'Email is required.',
  }),
  password: z.string({ required_error: 'Password is required.' }).min(1, {
    message: 'Password is required.',
  }),
});

export default function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;

  const router = useRouter();
  const { setIsVerifying, setEmail } = useAuthStore();
  const { toast } = useToast();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response && !response.ok) {
        if (response) {
          if (
            response.error?.replace('Error: ', '') ===
            'Your email is not verified'
          ) {
            setEmail(form.watch('email'));
            setIsVerifying(true);
            router.push('/sign-up');
          }

          return toast({
            title: 'An error occurred',
            description: response.error?.replace('Error: ', ''),
            variant: 'destructive',
          });
        }
      } else {
        router.push('/');
      }
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'An error occurred while signing in, please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mx-auto max-w-xs text-sm">
          Sign in to your account to continue using our services.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start gap-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="johndoe@email.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start gap-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        disabled={isLoading}
                        placeholder="••••••••••••"
                        type={isPasswordVisible ? 'text' : 'password'}
                        {...field}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="absolute right-1 top-1/2 h-[80%] -translate-y-1/2 transform"
                        onMouseDown={() => setIsPasswordVisible(true)}
                        onMouseUp={() => setIsPasswordVisible(false)}
                        onMouseLeave={() => setIsPasswordVisible(false)}
                      >
                        {isPasswordVisible ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading}>
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </Button>
          </form>
        </Form>

        <p className="px-8 text-center text-sm text-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="text-sm underline underline-offset-4 transition-all hover:text-foreground/80"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
