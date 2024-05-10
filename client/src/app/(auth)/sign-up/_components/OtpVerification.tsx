'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { useAuthStore } from '@/hooks/useAuthStore';

interface OtpVerification {
  email: string;
}

export default function OtpVerification({ email }: OtpVerification) {
  const [otp, setOtp] = useState('');

  const router = useRouter();
  const { setEmail, setIsVerifying } = useAuthStore();
  const { toast } = useToast();

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: async () => {
      const body = {
        email,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend/email`,
        body
      );

      return response.data;
    },
    onError: (error) => {
      return toast({
        title: 'Failed to resend OTP',
        description: 'Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      return toast({
        title: 'OTP Resent',
        description: 'We have resent the OTP to your email.',
      });
    },
  });

  const { mutate: verify, isPending } = useMutation({
    mutationFn: async () => {
      const body = {
        email,
        otp,
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify/email`,
        body
      );

      return response.data;
    },
    onError: () => {
      setOtp('');
      return toast({
        title: 'Invalid OTP',
        description: 'The OTP you entered is invalid, please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      router.push('/sign-in');
      setIsVerifying(false);
      setEmail(null);
      return toast({
        title: 'Email Verified',
        description: 'You can now sign in with your email and password.',
      });
    },
  });

  useEffect(() => {
    if (otp.length === 6) {
      verify();
    }
  }, [otp]);

  return (
    <div className="mx-auto flex h-full max-w-4xl items-center">
      <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify your email
          </h1>
          <p className="mx-auto max-w-xs text-sm">
            We&apos;ve sent a 6-digit code to{' '}
            <span className="font-semibold">{email}</span>, please enter it
            below to verify your email and be able to sign in.
          </p>

          <div className="flex items-center justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value: string) => setOtp(value)}
              disabled={isPending}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <p className="px-8 text-center text-sm text-foreground">
              Didn&apos;t receive the code?{' '}
              <Button
                variant="link"
                disabled={isPending || isResending}
                onClick={() => resend()}
                className="h-0 p-0"
              >
                Resend
              </Button>
            </p>
            <p className="px-8 text-center text-sm text-foreground">
              Not your email?{' '}
              <Button
                variant="link"
                disabled={isPending}
                onClick={() => {
                  setIsVerifying(false);
                  setEmail(null);
                }}
                className="h-0 p-0"
              >
                Sign Up
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
