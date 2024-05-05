'use client';

import { z } from 'zod';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
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
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';

const formSchema = z.object({
  temperature: z.number().optional(),
  heartRate: z.number().optional(),
  systolicBloodPressure: z.number().optional(),
  diastolicBloodPressure: z.number().optional(),
  respiratoryRate: z.number().optional(),
  oxygenSaturation: z.number().optional(),
});

interface VitalsFormProps {
  vitalsId: string;
  appointmentId: string;
  onClose: () => void;
  defaultValues?: z.infer<typeof formSchema>;
}

export default function VitalsForm({
  vitalsId,
  appointmentId,
  onClose,
  defaultValues,
}: VitalsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const accessToken = useAccessToken();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: mutateVitals, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/vitals/${vitalsId}`,
        {
          temperature: values.temperature,
          heartRate: values.heartRate,
          systolicBloodPressure: values.systolicBloodPressure,
          diastolicBloodPressure: values.diastolicBloodPressure,
          respiratoryRate: values.respiratoryRate,
          oxygenSaturation: values.oxygenSaturation,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response;
    },
    onError: () => {
      return toast({
        title: `Failed to update patient's vitals`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`appointment_${appointmentId}`],
      });

      onClose();

      return toast({
        title: `Updated patient's vitals successfully`,
        description: `Patient's vitals have been updated successfully.`,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => mutateVitals(e))}
        className="space-y-6 px-4 py-2 text-foreground"
      >
        <div className="w-full space-y-2">
          <div>
            <h3 className="text-lg font-medium">
              Update Patient&apos;s Vitals
            </h3>
            <p className="text-sm text-muted-foreground">
              Update the patient&apos;s vitals for this appointment.
            </p>
          </div>
          <Separator className="bg-primary/10" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            name="temperature"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Temperature</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="number"
                    placeholder="36"
                    {...field}
                    value={field.value}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="heartRate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Heart Rate</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="number"
                    placeholder="70"
                    {...field}
                    value={field.value}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="systolicBloodPressure"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Systolic Blood Pressure</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="text"
                    placeholder="120"
                    {...field}
                    value={field.value}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="diastolicBloodPressure"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Diastolic Blood Pressure</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="number"
                    placeholder="80"
                    {...field}
                    value={field.value}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="respiratoryRate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Respiratory Rate</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="number"
                    placeholder="16"
                    {...field}
                    value={field.value}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="oxygenSaturation"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Oxygen Saturation</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="number"
                    placeholder="98"
                    {...field}
                    value={field.value}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between gap-2">
          <Button type="submit" size="sm" disabled={isPending}>
            Update Vitals
          </Button>
        </div>
      </form>
    </Form>
  );
}
