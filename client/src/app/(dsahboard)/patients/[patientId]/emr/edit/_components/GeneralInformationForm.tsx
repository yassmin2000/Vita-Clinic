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
}

export default function GeneralInformationForm({
  patientId,
  defaultValues,
}: GeneralInformationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const accessToken = useAccessToken();
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
          Add or edit the general information of the patient.
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
            </div>

            <div className="flex gap-4">
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
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <Button type="submit" size="sm" disabled={isPending}>
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
