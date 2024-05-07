'use client';

import { z } from 'zod';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import { cn } from '@/lib/utils';

import type { Medication, Therapy } from '@/types/settings.type';

const formSchema = z.object({
  name: z.string({
    required_error: 'Treatment title is required',
  }),
  therapy: z.object(
    {
      label: z.string(),
      value: z.string(),
      unit: z.string(),
    },
    {
      required_error: 'Therapy is required',
    }
  ),
  dosage: z.number({
    required_error: 'Treatment dosage is required',
  }),
  duration: z.number({
    required_error: 'Treatment duration is required',
  }),
  response: z.string().optional(),
  sideEffect: z.string().optional(),
  notes: z.string().optional(),
});

interface TreatmentFormProps {
  appointmentId: string;
  onClose: () => void;
  defaultValues?: z.infer<typeof formSchema>;
}

export default function TreatmentForm({
  appointmentId,
  onClose,
  defaultValues,
}: TreatmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const accessToken = useAccessToken();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: therapies, isLoading: isLoadingTherapies } = useQuery({
    queryKey: ['therapies_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/therapies`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as Therapy[];

      if (data) {
        return data.map((therapy) => ({
          label: therapy.name,
          value: therapy.id,
          unit: therapy.unit,
        }));
      }

      return [];
    },
    enabled: !!accessToken,
  });

  const { mutate: mutateTreatment, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/treatments`,
        {
          name: values.name,
          appointmentId,
          therapyId: values.therapy.value,
          dosage: values.dosage,
          duration: values.duration,
          response: values.response,
          sideEffect: values.sideEffect,
          notes: values.notes,
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
        title: `Failed to create treatment`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`treatments_${appointmentId}`],
      });

      onClose();

      return toast({
        title: `Created treatment successfully`,
        description: `Treatment has been created successfully.`,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => mutateTreatment(e))}
        className="space-y-6 px-4 py-2 text-foreground"
      >
        <div className="w-full space-y-2">
          <div>
            <h3 className="text-lg font-medium">Create Treatment</h3>
            <p className="text-sm text-muted-foreground">
              Create a new treatment for the patient in this appointment.
            </p>
          </div>
          <Separator className="bg-primary/10" />
        </div>

        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel required>Treatment Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Treatment title..."
                    {...field}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="therapy"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel required>Therapy</FormLabel>
                <FormControl>
                  <Combobox
                    value={field.value?.value || ''}
                    onChange={(e) =>
                      field.onChange({
                        label:
                          therapies?.find((therapy) => therapy.value === e)
                            ?.label || '',
                        value: e,
                        unit: therapies?.find((therapy) => therapy.value === e)
                          ?.unit,
                      })
                    }
                    placeholder="Select therapy..."
                    inputPlaceholder="Search therapies..."
                    options={
                      therapies
                        ? therapies.map((therapy) => ({
                            label: therapy.label,
                            value: therapy.value,
                          }))
                        : []
                    }
                    disabled={isLoadingTherapies}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="dosage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>
                  Dosage{' '}
                  {form.getValues('therapy') &&
                    `(${form.getValues('therapy.unit')} per cycle)`}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="duration"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Duration (Cycles)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="6"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="response"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Patient Response</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Patient response..."
                    {...field}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="sideEffect"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Side Effects</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Side effects..."
                    {...field}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="notes"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Notes..."
                    minRows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between gap-2">
          <Button type="submit" size="sm" disabled={isPending}>
            Create Prescription
          </Button>
        </div>
      </form>
    </Form>
  );
}
