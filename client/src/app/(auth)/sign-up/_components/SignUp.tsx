'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { format } from 'date-fns';
import { CalendarIcon, Eye, EyeOff } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';

const formSchema = z.object({
  firstName: z.string({ required_error: 'First name is required.' }).min(1, {
    message: 'First name is required.',
  }),
  lastName: z.string({ required_error: 'Last name is required.' }).min(1, {
    message: 'Last name is required.',
  }),
  email: z.string({ required_error: 'Email is required' }).email().min(1, {
    message: 'Email is required.',
  }),
  password: z.string({ required_error: 'Password is required.' }).min(1, {
    message: 'Password is required.',
  }),
  confirmPassword: z
    .string({ required_error: "Passwords don't match." })
    .min(1, {
      message: "Passwords don't match.",
    }),
  birthDate: z
    .date({
      required_error: 'Birth date is required.',
    })
    .max(new Date(), {
      message: 'Birth date cannot be in the future.',
    }),
  sex: z.enum(['male', 'female'], {
    required_error: 'Gender is required.',
    invalid_type_error: 'Gender is invalid.',
  }),
  address: z.string().optional(),
  phone: z
    .string({ required_error: 'Phone number is required.' })
    .refine(isValidPhoneNumber, { message: 'Invalid phone number.' }),
});

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;

  const { toast } = useToast();
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.password !== values.confirmPassword) {
      form.setError('confirmPassword', {
        message: "Passwords don't match.",
      });
    }
    // Register user
  };

  return (
    <div className="container mx-auto flex w-full flex-col justify-center px-4 sm:w-[600px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Getting Started
        </h1>
        <p className="mx-auto max-w-sm text-sm">
          By continuting, you are setting up an account and agree to our User
          Agreement and Privacy Policy.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 overflow-y-auto px-2"
          >
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col items-start gap-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Joe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col items-start gap-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col items-start gap-1">
                    <FormLabel>Date of birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick the birthdate</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="sex"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col items-start gap-1">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select the gender"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start gap-1">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="johndoe@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start gap-1">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput placeholder="Enter a phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        placeholder="strong@password##"
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
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start gap-1">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        disabled={isLoading}
                        placeholder="strong@password##"
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

            <Button className="w-full sm:w-[200px]" disabled={isLoading}>
              <span>{isLoading ? 'Signing up...' : 'Sign Up'}</span>
            </Button>
          </form>
        </Form>

        <p className="px-8 text-center text-sm text-zinc-700">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-sm underline underline-offset-4 transition-all hover:text-zinc-800"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
