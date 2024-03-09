'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import ImageUpload from '@/components/ImageUpload';
import { Input } from '@/components/ui/input';
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
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { useUploadThing } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: 'First name is required.',
  }),
  lastName: z.string().min(1, {
    message: 'Last name is required.',
  }),
  role: z.enum(['admin', 'doctor', 'patient'], {
    required_error: 'Role is required.',
    invalid_type_error: 'Role is invalid.',
  }),
  email: z.string().email().min(1, {
    message: 'Email is required.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
  sex: z.enum(['male', 'female'], {
    required_error: 'Gender is required.',
    invalid_type_error: 'Gender is invalid.',
  }),
  birthDate: z
    .date({
      required_error: 'Birth date is required.',
    })
    .max(new Date(), {
      message: 'Birth date cannot be in the future.',
    }),
  speciality: z.string().optional(),
  avatar: z.instanceof(File).optional(),
});

export default function UserForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role')?.toLocaleLowerCase();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { startUpload } = useUploadThing('imageUploader');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role:
        role && (role === 'admin' || role === 'patient' || role === 'doctor')
          ? role
          : undefined,
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    if (values.avatar) {
      const res = await startUpload([values.avatar]);
      if (res) {
        const [fileResponse] = res;
        const url = fileResponse.url;
        console.log(url);
      }
    }
  };

  return (
    <div className="mx-auto h-full max-w-3xl space-y-2 p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="w-full space-y-2">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about the user
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="avatar"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="sex"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
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

            <FormField
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Role</FormLabel>
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
                          placeholder="Select the user role"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="col-span-2 flex flex-col md:col-span-1">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
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
          </div>

          <div className="w-full space-y-2">
            <div>
              <h3 className="text-lg font-medium">Credentials</h3>
              <p className="text-sm text-muted-foreground">
                Credentials for the user
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
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
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
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

          {/* 
          <FormField
            name='instructions'
            control={form.control}
            render={({ field }) => (
              <FormItem className='col-span-2 md:col-span-1'>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    className='bg-background resize-none'
                    rows={7}
                    disabled={isLoading}
                    placeholder={PREAMBLE}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Describe in details your amigo&appos;s background and relevant
                  details.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            name='seed'
            control={form.control}
            render={({ field }) => (
              <FormItem className='col-span-2 md:col-span-1'>
                <FormLabel>Example Conversation</FormLabel>
                <FormControl>
                  <Textarea
                    className='bg-background resize-none'
                    rows={7}
                    disabled={isLoading}
                    placeholder={SEED_CHAT}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Describe in details your amigo&appos;s background and relevant
                  details.
                </FormDescription>
              </FormItem>
            )}
          />

          <div className='w-full flex justify-center'>
            <Button size='lg' disabled={isLoading}>
              {initialData ? 'Edit your amigo' : 'Create your amigo'}
              <Wand2 className='w-4 h-4 ml-2' />
            </Button>
          </div> */}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
