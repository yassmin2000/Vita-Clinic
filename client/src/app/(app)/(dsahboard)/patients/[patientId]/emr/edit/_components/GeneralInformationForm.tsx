'use client';

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';
import {
  alcoholStatus,
  bloodTypes,
  drugStatus,
  smokingStatus,
} from '@/lib/constants';

const formSchema = z.object({
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
});

interface GeneralInformationFormProps {
  patientId: string;
  defaultValues: z.infer<typeof formSchema>;
  view?: boolean;
}

export default function GeneralInformationForm({
  patientId,
  defaultValues,
  view = false,
}: GeneralInformationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const accessToken = useAccessToken();
  const { role } = useUserRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: mutatePatientGeneralInformation, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const body = {
        height: values.height,
        weight: values.weight,
        bloodType: values.bloodType,
        smokingStatus: values.smokingStatus,
        alcoholStatus: values.alcoholStatus,
        drugsUsage: values.drugsUsage,
      };

      return await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/emr/${patientId}`,
        body,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onError: () => {
      return toast({
        title: `Failed to update patient's general information`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`emr_${patientId}`],
      });

      return toast({
        title: `Patient's general information updated successfully`,
        description: `Patient's general information have been updated successfuly.`,
      });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-primary">
          Patient General Information
        </h2>
        <h3 className="text-sm text-muted-foreground">
          {view
            ? role === 'patient'
              ? 'View your general information.'
              : 'View the general information of the patient.'
            : 'Edit the general information of the patient.'}
        </h3>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((e) =>
            mutatePatientGeneralInformation(e)
          )}
          className="space-y-6 text-foreground"
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <FormField
                name="weight"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel
                      className={cn(view && 'font-medium text-primary')}
                    >
                      Weight (kg)
                    </FormLabel>
                    {!view ? (
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
                    ) : (
                      <p>
                        {defaultValues.weight
                          ? `${defaultValues.weight} kg`
                          : 'NA'}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="height"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel
                      className={cn(view && 'font-medium text-primary')}
                    >
                      Height (cm)
                    </FormLabel>
                    {!view ? (
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
                    ) : (
                      <p>
                        {defaultValues.height
                          ? `${defaultValues.height} cm`
                          : 'NA'}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="bloodType"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel
                      className={cn(view && 'font-medium text-primary')}
                    >
                      Blood Type
                    </FormLabel>
                    {!view ? (
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
                    ) : (
                      <p>
                        {defaultValues.bloodType
                          ? bloodTypes.find(
                              (type) => type.value === defaultValues.bloodType
                            )?.label
                          : 'NA'}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                name="smokingStatus"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel
                      className={cn(view && 'font-medium text-primary')}
                    >
                      Smoking Status
                    </FormLabel>
                    {!view ? (
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
                    ) : (
                      <p>
                        {defaultValues.smokingStatus
                          ? smokingStatus.find(
                              (status) =>
                                status.value === defaultValues.smokingStatus
                            )?.label
                          : 'NA'}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="alcoholStatus"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel
                      className={cn(view && 'font-medium text-primary')}
                    >
                      Alcohol Status
                    </FormLabel>
                    {!view ? (
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
                    ) : (
                      <p>
                        {defaultValues.alcoholStatus
                          ? alcoholStatus.find(
                              (status) =>
                                status.value === defaultValues.alcoholStatus
                            )?.label
                          : 'NA'}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="drugsUsage"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel
                      className={cn(view && 'font-medium text-primary')}
                    >
                      Drugs Usage
                    </FormLabel>
                    {!view ? (
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
                    ) : (
                      <p>
                        {defaultValues.drugsUsage
                          ? drugStatus.find(
                              (status) =>
                                status.value === defaultValues.drugsUsage
                            )?.label
                          : 'NA'}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {!view && (
            <div className="flex justify-between gap-2">
              <Button type="submit" size="sm" disabled={isPending}>
                Update
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
