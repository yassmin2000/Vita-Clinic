'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
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

import useAccessToken from '@/hooks/useAccessToken';

const formSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Current password is required.' })
    .min(1, {
      message: 'Current password is required.',
    }),
  newPassword: z.string({ required_error: 'Password is required.' }).min(1, {
    message: 'Password is required.',
  }),
  confirmNewPassword: z
    .string({ required_error: "Passwords don't match." })
    .min(1, {
      message: "Passwords don't match.",
    }),
});

export default function UpdatePasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const accessToken = useAccessToken();
  const { toast } = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const body = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/password`,
        body,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to update password');
      }

      return response;
    },
    onError: () => {
      return toast({
        title: 'Failed to update password',
        description: 'Your old password is incorrect. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      return toast({
        title: 'Password updated successfully',
        description: 'Your password has been updated successfully.',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.newPassword !== values.confirmNewPassword) {
      return form.setError('confirmNewPassword', {
        message: "Passwords don't match.",
      });
    }

    form.clearErrors('confirmNewPassword');
    updatePassword(values);
  };

  return (
    <Card>
      <CardContent className="py-4">
        <h4 className="mb-3 text-lg font-semibold">Password</h4>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="currentPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start gap-1">
                  <FormLabel required>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        disabled={isPending}
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

            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start gap-1">
                  <FormLabel required>New Password</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        disabled={isPending}
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

            <FormField
              name="confirmNewPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start gap-1">
                  <FormLabel required>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        disabled={isPending}
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
            <div className="mt-2 flex items-center gap-2 self-end">
              <Button
                variant="outline"
                disabled={isPending}
                type="button"
                onClick={() => {
                  form.setValue('currentPassword', '');
                  form.setValue('newPassword', '');
                  form.setValue('confirmNewPassword', '');
                }}
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
