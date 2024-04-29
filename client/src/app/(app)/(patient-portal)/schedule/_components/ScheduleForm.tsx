'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from '@/components/ui/time-picker';
import {
  SelectContent,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MultipleSelector from '@/components/ui/multiple-selector';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';

import type { LaboratoryTest, PriceLookup } from '@/types/settings.type';

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  dateTime: z.date(),
  service: z.string().optional(),
  imaging: z.array(optionSchema).min(0).optional(),
  lab: z.array(optionSchema).min(0).optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
});

export default function ScheduleForm() {
  const router = useRouter();
  const accessToken = useAccessToken();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTime: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  });
  const { toast } = useToast();

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/services`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as PriceLookup[];

      return data.map((service) => ({
        label: `${service.name} (${service.price}$)`,
        value: service.id,
      }));
    },
    enabled: !!accessToken,
  });

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

      const data = response.data as PriceLookup[];

      return data.map((modality) => ({
        label: `${modality.name} (${modality.price}$)`,
        value: modality.id,
      }));
    },
    enabled: !!accessToken,
  });

  const { data: modalities, isLoading: isLoadingModalities } = useQuery({
    queryKey: ['modalities_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/modalities`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as PriceLookup[];

      return data.map((modality) => ({
        label: `${modality.name} (${modality.price}$)`,
        value: modality.id,
      }));
    },
    enabled: !!accessToken,
  });

  const { data: laboratoryTests, isLoading: isLoadingLaboratoryTests } =
    useQuery({
      queryKey: ['laboratory-tests_form'],
      queryFn: async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/laboratory-tests`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = response.data as LaboratoryTest[];

        return data.map((modality) => ({
          label: `${modality.name} (${modality.price}$)`,
          value: modality.id,
        }));
      },
      enabled: !!accessToken,
    });

  const { mutate: createAppointment, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const body = {
        date: values.dateTime.toISOString(),
        service: values.service,
        therapy: values.treatment,
        scans: values.imaging?.map((imaging) => imaging.value) || [],
        labWorks: values.lab?.map((lab) => lab.value) || [],
        notes: values.notes,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        body,
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
        title: `Failed to book an appointment`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      router.push('/portal');
      return toast({
        title: `Booked successfully`,
        description: `Your appointment has been booked successfully.`,
      });
    },
  });

  const isLoading =
    isLoadingServices ||
    isLoadingTherapies ||
    isLoadingModalities ||
    isLoadingLaboratoryTests;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => createAppointment(e))}
        className="flex flex-col gap-8 md:flex-row"
      >
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="w-fit rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                  <TimePicker date={field.value} setDate={field.onChange} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex w-full flex-1 flex-col justify-between gap-2">
          <div className="flex w-full flex-col flex-wrap items-center gap-2 sm:flex-row">
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem className="w-full flex-1 md:w-fit">
                  <FormLabel>
                    Service
                    <span className="text-xs text-gray-500"> (Optional)</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading || isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select service.."
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services &&
                        services.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem className="w-full flex-1 md:w-fit">
                  <FormLabel>
                    Treatment
                    <span className="text-xs text-gray-500"> (Optional)</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading || isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select treatment.."
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {therapies &&
                        therapies.map((therapy) => (
                          <SelectItem key={therapy.value} value={therapy.value}>
                            {therapy.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex w-full flex-col flex-wrap items-center gap-2 sm:flex-row">
            <FormField
              control={form.control}
              name="imaging"
              render={({ field }) => (
                <FormItem className="w-full flex-1 md:w-fit">
                  <FormLabel>
                    Imaging
                    <span className="text-xs text-gray-500"> (Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading || isPending}
                      defaultOptions={modalities || []}
                      placeholder="Select imaging..."
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          No results found.
                        </p>
                      }
                      hidePlaceholderWhenSelected
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lab"
              render={({ field }) => (
                <FormItem className="w-full flex-1 md:w-fit">
                  <FormLabel>
                    Lab Work
                    <span className="text-xs text-gray-500"> (Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <MultipleSelector
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading || isPending}
                      defaultOptions={laboratoryTests || []}
                      placeholder="Select lab work..."
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          No results found.
                        </p>
                      }
                      hidePlaceholderWhenSelected
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>
                  Extra Notes
                  <span className="text-xs text-gray-500"> (Optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading || isPending}
                    {...field}
                    minRows={5}
                    placeholder="Add notes..."
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            className="w-fit self-start"
            type="submit"
            disabled={isLoading || isPending}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
