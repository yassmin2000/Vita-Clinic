'use client';

import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Edit, Plus, X } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

import useAccessToken from '@/hooks/useAccessToken';
import { cn } from '@/lib/utils';

import type { PatientSurgeryField } from './PatientSurgeries';
import type { Lookup } from '@/types/settings.type';

const formSchema = z.object({
  surgery: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    {
      required_error: 'Surgery is required',
    }
  ),
  date: z
    .date({
      required_error: 'Surgery date is required.',
    })
    .max(new Date(), {
      message: 'Surgery date cannot be in the future.',
    }),
  notes: z.string().optional().nullable(),
});

interface PatientSurgeriesFormProps {
  patientSurgeries: PatientSurgeryField[];
  setSurgeries: Dispatch<SetStateAction<PatientSurgeryField[]>>;
  currentSurgery: PatientSurgeryField | null;
  setCurrentSurgery: Dispatch<SetStateAction<PatientSurgeryField | null>>;
}

export default function PatientSurgeriesForm({
  patientSurgeries,
  setSurgeries,
  currentSurgery,
  setCurrentSurgery,
}: PatientSurgeriesFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const accessToken = useAccessToken();

  const { data: surgeries, isLoading: isLoadingSurgeries } = useQuery({
    queryKey: ['surgeries_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/surgeries`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as Lookup[];

      if (data) {
        return data.map((surgery) => ({
          label: surgery.name,
          value: surgery.id,
        }));
      }

      return [];
    },
    enabled: !!accessToken,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (currentSurgery) {
      setSurgeries((prev) =>
        prev.map((surgery) =>
          surgery.id === currentSurgery.id
            ? {
                ...surgery,
                surgeryId: data.surgery.value,
                date: data.date.toISOString(),
                notes: data.notes || undefined,
                surgery: {
                  name: data.surgery.label,
                },
                updatedAt: new Date().toISOString(),
                isNew: currentSurgery.isNew,
                isUpdated: true,
              }
            : surgery
        )
      );
    } else {
      setSurgeries((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          surgeryId: data.surgery.value,
          date: data.date.toISOString(),
          notes: data.notes || undefined,
          surgery: {
            name: data.surgery.label,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isNew: true,
        },
      ]);
    }

    form.reset();
    // form.resetField('surgery');
    // form.setValue('reaction', '');
    form.setValue('notes', '');
    setCurrentSurgery(null);
  };

  useEffect(() => {
    if (currentSurgery) {
      form.setValue('surgery', {
        label: currentSurgery.surgery.name,
        value: currentSurgery.surgeryId,
      });
      form.setValue('date', new Date(currentSurgery.date));
      form.setValue('notes', currentSurgery.notes);
    }
  }, [currentSurgery]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 text-foreground"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <FormField
              name="surgery"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>Surgery</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value?.value || ''}
                      onChange={(e) =>
                        field.onChange({
                          label:
                            surgeries?.find((surgery) => surgery.value === e)
                              ?.label || '',
                          value: e,
                        })
                      }
                      placeholder="Select surgery..."
                      inputPlaceholder="Search surgeries..."
                      options={
                        surgeries
                          ? surgeries.map((surgery) => ({
                              label: surgery.label,
                              value: surgery.value,
                              disabled: patientSurgeries.some(
                                (alg) =>
                                  !alg.isDeleted &&
                                  alg.surgeryId === surgery.value
                              ),
                            }))
                          : []
                      }
                      disabled={isLoadingSurgeries || currentSurgery !== null}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>Surgery date</FormLabel>
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
                            <span>Pick surgery date</span>
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

          <FormField
            name="notes"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
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

          <div className="flex flex-wrap gap-4">
            {currentSurgery && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setCurrentSurgery(null);
                  form.reset();
                }}
                className="flex w-full items-center gap-2 sm:w-[100px]"
              >
                <X className="h-5 w-5" />
                Cancel
              </Button>
            )}

            <Button className="flex w-full items-center gap-2 sm:w-[100px]">
              {currentSurgery ? (
                <Edit className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {currentSurgery ? 'Edit' : 'Add'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
