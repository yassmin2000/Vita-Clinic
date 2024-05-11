'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';

import { cn } from '@/lib/utils';

const formSchema = z.object({
  insuranceProvider: z.string(),
  insurancePolicyNumber: z.string(),
  insurancePolicyStartDate: z.date(),
  insurancePolicyEndDate: z.date(),
});

interface InsuranceFormProps {
  patientId: string;
  isInsuranceExisting: boolean;
  patientName: string;
  defaultValues?: z.infer<typeof formSchema>;
  onClose: () => void;
}

export default function InsuranceForm({
  patientId,
  isInsuranceExisting,
  patientName,
  defaultValues,
  onClose,
}: InsuranceFormProps) {
  const accessToken = useAccessToken();
  const { isSuperAdmin } = useUserRole();
  const { toast } = useToast();

  const [hasInsurance, setHasInsurance] =
    useState<boolean>(isInsuranceExisting);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutate: createInsurance, isPending: isCreatingInsurance } =
    useMutation({
      mutationFn: async (values: z.infer<typeof formSchema>) => {
        return await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/patients/${patientId}/insurance`,
          {
            provider: values.insuranceProvider,
            policyNumber: values.insurancePolicyNumber,
            policyStartDate: values.insurancePolicyStartDate,
            policyEndDate: values.insurancePolicyEndDate,
          },
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
      },
      onError: () => {
        return toast({
          title: `Failed to create insurance`,
          description: 'Please try again later.',
          variant: 'destructive',
        });
      },
      onSuccess: () => {
        onClose();
        return toast({
          title: `Insurance created successfully`,
          description: 'The insurance has been created successfully.',
        });
      },
    });

  const { mutate: updateInsurance, isPending: isUpdatingInsurance } =
    useMutation({
      mutationFn: async (values: z.infer<typeof formSchema>) => {
        return await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/patients/${patientId}/insurance`,
          {
            provider: values.insuranceProvider,
            policyNumber: values.insurancePolicyNumber,
            policyStartDate: values.insurancePolicyStartDate,
            policyEndDate: values.insurancePolicyEndDate,
          },
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
      },
      onError: () => {
        return toast({
          title: `Failed to update insurance`,
          description: 'Please try again later.',
          variant: 'destructive',
        });
      },
      onSuccess: () => {
        onClose();
        return toast({
          title: `Insurance updated successfully`,
          description: 'The insurance has been updated successfully.',
        });
      },
    });

  const { mutate: deleteInsurance, isPending: isDeletingInsurance } =
    useMutation({
      mutationFn: async () => {
        return await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/users/patients/${patientId}/insurance`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
      },
      onError: () => {
        return toast({
          title: `Failed to delete insurance`,
          description: 'Please try again later.',
          variant: 'destructive',
        });
      },
      onSuccess: () => {
        onClose();
        return toast({
          title: `Insurance deleted successfully`,
          description: 'The insurance has been deleted successfully.',
        });
      },
    });

  const isLoading =
    isCreatingInsurance || isUpdatingInsurance || isDeletingInsurance;

  return (
    <div className="space-y-6 px-4 py-2 text-foreground">
      <div className="w-full space-y-2">
        <div>
          <h3 className="text-xl font-medium">Update Patient Insurance</h3>
          <p className="text-sm text-muted-foreground">
            Update the insurance details for{' '}
            <span className="font-medium text-primary">{patientName}</span>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="hasInsurance"
          checked={hasInsurance}
          disabled={isInsuranceExisting && !isSuperAdmin}
          onClick={() => {
            setHasInsurance((value) => !value);
          }}
        />
        <label
          htmlFor="hasInsurance"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          This patient has health insurance
        </label>
      </div>

      <Form {...form}>
        <form className="space-y-8 text-foreground">
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
              name="insuranceProvider"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Insurance Provider</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading || !hasInsurance}
                      placeholder="ABC Health"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="insurancePolicyNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Insurance Policy Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading || !hasInsurance}
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
              name="insurancePolicyStartDate"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Insurance Policy Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isLoading || !hasInsurance}
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
              name="insurancePolicyEndDate"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Insurance Policy End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isLoading || !hasInsurance}
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
                            form.getValues('insurancePolicyStartDate') ||
                              '1900-01-01'
                          )
                        }
                        fromYear={new Date(
                          form.getValues('insurancePolicyStartDate') ||
                            '1900-01-01'
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
        </form>
      </Form>

      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled={isLoading} onClick={onClose}>
          Cancel
        </Button>
        {hasInsurance && !isInsuranceExisting && (
          <Button
            disabled={isLoading}
            onClick={form.handleSubmit((e) => createInsurance(e))}
          >
            Create
          </Button>
        )}
        {hasInsurance && isInsuranceExisting && (
          <Button
            disabled={isLoading}
            onClick={form.handleSubmit((e) => updateInsurance(e))}
          >
            Update
          </Button>
        )}
        {!hasInsurance && isInsuranceExisting && (
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={() => deleteInsurance()}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
