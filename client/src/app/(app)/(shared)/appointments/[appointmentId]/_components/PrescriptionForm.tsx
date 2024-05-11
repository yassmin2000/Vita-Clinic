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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import { cn } from '@/lib/utils';

import type { Medication } from '@/types/settings.type';

const formSchema = z.object({
  medication: z.object(
    {
      label: z.string(),
      value: z.string(),
      unit: z.string(),
    },
    {
      required_error: 'Medication is required',
    }
  ),
  startDate: z
    .date()
    .max(new Date(), {
      message: 'Medication date cannot be in the future.',
    })
    .optional(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
  dosage: z.number().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  required: z.boolean().optional(),
});

interface PrescriptionFormProps {
  appointmentId: string;
  onClose: () => void;
  defaultValues?: z.infer<typeof formSchema>;
}

export default function PrescriptionForm({
  appointmentId,
  onClose,
  defaultValues,
}: PrescriptionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const accessToken = useAccessToken();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: medications, isLoading: isLoadingMedications } = useQuery({
    queryKey: ['medications_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/medications`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as Medication[];

      if (data) {
        return data.map((medication) => ({
          label: medication.name,
          value: medication.id,
          unit: medication.unit,
        }));
      }

      return [];
    },
    enabled: !!accessToken,
  });

  const { mutate: mutatePrescriptions, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/prescriptions`,
        {
          appointmentId,
          medicationId: values.medication.value,
          notes: values.notes,
          startDate: values.startDate,
          endDate: values.endDate,
          dosage: values.dosage,
          frequency: values.frequency,
          required: values.required || false,
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
        title: `Failed to create prescription`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`prescriptions_${appointmentId}`],
      });

      onClose();

      return toast({
        title: `Created prescription successfully`,
        description: `Prescription has been created successfully.`,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => mutatePrescriptions(e))}
        className="space-y-6 px-4 py-2 text-foreground"
      >
        <div className="w-full space-y-2">
          <div>
            <h3 className="text-lg font-medium">Create Prescription</h3>
            <p className="text-sm text-muted-foreground">
              Create a new prescription for the patient in this appointment.
            </p>
          </div>
          <Separator className="bg-primary/10" />
        </div>

        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
          <FormField
            name="medication"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel required>Medication</FormLabel>
                <FormControl>
                  <Combobox
                    value={field.value?.value || ''}
                    onChange={(e) =>
                      field.onChange({
                        label:
                          medications?.find(
                            (medication) => medication.value === e
                          )?.label || '',
                        value: e,
                        unit: medications?.find(
                          (medication) => medication.value === e
                        )?.unit,
                      })
                    }
                    placeholder="Select medication..."
                    inputPlaceholder="Search medications..."
                    options={
                      medications
                        ? medications.map((medication) => ({
                            label: medication.label,
                            value: medication.value,
                          }))
                        : []
                    }
                    disabled={isLoadingMedications}
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
                <FormLabel>
                  Dosage{' '}
                  {form.getValues('medication') &&
                    `(${form.getValues('medication.unit')})`}
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
            name="frequency"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select dosage frequency"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medication Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'flex h-10 w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick medication start date</span>
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
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medication End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'flex h-10 w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick medication end date</span>
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
                        new Date(form.getValues('startDate') || '1900-01-01')
                      }
                      fromYear={new Date(
                        form.getValues('startDate') || '1900-01-01'
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

          <FormField
            name="required"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="required"
                      checked={field.value}
                      onClick={() => {
                        field.onChange(!field.value);
                      }}
                    />
                    <label
                      htmlFor="required"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      This medication is required
                    </label>
                  </div>
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
