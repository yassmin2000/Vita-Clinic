'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { isValidPhoneNumber } from 'react-phone-number-input';
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
import { PhoneInput } from '../ui/phone-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '../ui/combobox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '../ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';
import { useUploadThing } from '@/lib/uploadthing';

import { capitalize, cn } from '@/lib/utils';
import type { Lookup } from '@/types/settings.type';
import {
  alcoholStatus,
  bloodTypes,
  drugStatus,
  smokingStatus,
} from '@/lib/constants';
import { Checkbox } from '../ui/checkbox';

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
  phone: z
    .string({ required_error: 'Phone number is required.' })
    .refine(isValidPhoneNumber, { message: 'Invalid phone number.' }),
  address: z.string().min(1, {
    message: 'Address is required.',
  }),
  speciality: z.string().optional(),
  avatar: z.any().optional(),
  weight: z
    .number()
    .min(0, {
      message: 'Weight must be a positive number',
    })
    .optional(),
  height: z
    .number()
    .min(0, {
      message: 'Height must be a positive number',
    })
    .optional(),
  bloodType: z
    .enum([
      'a_positive',
      'a_negative',
      'b_positive',
      'b_negative',
      'ab_positive',
      'ab_negative',
      'o_positive',
      'o_negative',
    ])
    .optional(),
  smokingStatus: z.enum(['never', 'former', 'current']).optional(),
  alcoholStatus: z.enum(['never', 'former', 'current']).optional(),
  drugsUsage: z.enum(['never', 'former', 'current']).optional(),
  hasInsurance: z.boolean(),
  insurance: z
    .object({
      insuranceProvider: z.string().optional(),
      insurancePolicyNumber: z.string().optional(),
      insurancePolicyStartDate: z.date().optional(),
      insurancePolicyEndDate: z.date().optional(),
    })
    .optional(),
});

export default function UserForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role')?.toLocaleLowerCase();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { startUpload } = useUploadThing('imageUploader');
  const accessToken = useAccessToken();
  const { isSuperAdmin } = useUserRole();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role:
        (isSuperAdmin && role === 'admin') ||
        role === 'patient' ||
        role === 'doctor'
          ? role
          : undefined,
      hasInsurance: false,
    },
  });

  const { data: specialities, isLoading: isLoadingSpecialities } = useQuery({
    queryKey: ['specialities_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/specialities`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as Lookup[];

      if (data) {
        return data.map((manufacturer) => ({
          label: manufacturer.name,
          value: manufacturer.id,
        }));
      }

      return [];
    },
    enabled: !!accessToken,
  });

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      let url = '';
      if (values.avatar) {
        const res = await startUpload([values.avatar]);
        if (res) {
          const [fileResponse] = res;
          url = fileResponse.url;
        }
      }

      let insurance = undefined;
      if (values.hasInsurance) {
        insurance = {
          provider: values.insurance?.insuranceProvider,
          policyNumber: values.insurance?.insurancePolicyNumber,
          policyStartDate: values.insurance?.insurancePolicyStartDate
            ? values.insurance?.insurancePolicyStartDate.toISOString()
            : undefined,
          policyEndDate: values.insurance?.insurancePolicyEndDate
            ? values.insurance?.insurancePolicyEndDate.toISOString()
            : undefined,
        };
      }

      const body = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        avatarURL: url || undefined,
        birthDate: values.birthDate.toISOString(),
        phoneNumber: values.phone,
        address: values.address,
        sex: values.sex,
        role: values.role,
        specialityId: values.speciality,
        weight: values.weight,
        height: values.height,
        bloodType: values.bloodType,
        smokingStatus: values.smokingStatus,
        alcoholStatus: values.alcoholStatus,
        drugsUsage: values.drugsUsage,
        insurance,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        body,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status !== 201) {
        throw new Error('Failed to create user');
      }

      return router.back();
    },
    onError: (error) => {
      const axiosError = error as AxiosError<any, any>;

      return toast({
        title: `Failed to create ${form.watch('role')}`,
        description:
          axiosError?.response?.data.message ||
          `${capitalize(form.watch('role'))} could not be created, please try again.`,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      return toast({
        title: `Created ${form.watch('role')} successfully`,
        description: `${capitalize(form.watch('role'))} has been created successfully.`,
      });
    },
  });

  return (
    <div className="mx-auto h-full max-w-3xl space-y-2 p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((e) => createUser(e))}
          className="space-y-8 pb-10 text-foreground"
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
                    disabled={isPending}
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
                  <FormLabel required>First Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="John" {...field} />
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
                  <FormLabel required>Last Name</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Doe" {...field} />
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
                  <FormLabel required>Gender</FormLabel>
                  <Select
                    disabled={isPending}
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
                  <FormLabel required>Role</FormLabel>
                  <Select
                    disabled={isPending}
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
                      {isSuperAdmin && (
                        <SelectItem value="admin">Admin</SelectItem>
                      )}
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
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isPending}
                          className={cn(
                            'flex h-10 w-full pl-3 text-left font-normal',
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
                        captionLayout="dropdown-buttons"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Address..."
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
                <FormItem className="col-span-2">
                  <FormLabel required>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput placeholder="Enter a phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('role') === 'doctor' && (
              <FormField
                name="speciality"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel required>Speciality</FormLabel>
                    <FormControl>
                      <Combobox
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select doctor speciality..."
                        inputPlaceholder="Search specialities..."
                        options={specialities || []}
                        disabled={isPending || isLoadingSpecialities}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {form.watch('role') === 'patient' && (
            <>
              <div className="w-full space-y-2">
                <div>
                  <h3 className="text-lg font-medium">
                    Patient General Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    General information about the patient
                  </p>
                </div>
                <Separator className="bg-primary/10" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  name="weight"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="number"
                          placeholder="90"
                          {...field}
                          value={field.value || undefined}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="height"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="number"
                          placeholder="75"
                          {...field}
                          value={field.value || undefined}
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="bloodType"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Blood Type</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select patient's blood type"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodTypes.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="smokingStatus"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Smoking Status</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select patient's smoking status"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {smokingStatus.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="alcoholStatus"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Alcohol Status</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select patient's alcohol status"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {alcoholStatus.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="drugsUsage"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Drugs Usage</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Select patient's drugs usage"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {drugStatus.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="hasInsurance"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-2">
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="hasInsurance"
                            checked={field.value}
                            onClick={() => {
                              field.onChange(!field.value);
                            }}
                          />
                          <label
                            htmlFor="hasInsurance"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            This patient has health insurance
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          {form.watch('hasInsurance') && (
            <>
              <div className="w-full space-y-2">
                <div>
                  <h3 className="text-lg font-medium">Insurance Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Information about the patient&apos;s insurance
                  </p>
                </div>
                <Separator className="bg-primary/10" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  name="insurance.insuranceProvider"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel required>Insurance Provider</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="ABC Health"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="insurance.insurancePolicyNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel required>Insurance Policy Number</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="XXYYZZ123"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insurance.insurancePolicyStartDate"
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel required>
                        Insurance Policy Start Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              disabled={isPending}
                              className={cn(
                                'flex h-10 w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick the start date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insurance.insurancePolicyEndDate"
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel required>Insurance Policy End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              disabled={isPending}
                              className={cn(
                                'flex h-10 w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick the end date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              new Date(
                                form.getValues(
                                  'insurance.insurancePolicyStartDate'
                                ) || '1900-01-01'
                              )
                            }
                            fromYear={new Date(
                              form.getValues(
                                'insurance.insurancePolicyStartDate'
                              ) || '1900-01-01'
                            ).getFullYear()}
                            toYear={2040}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

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
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
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
                <FormLabel required>Password</FormLabel>
                <FormControl>
                  <div className="relative">
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

          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
