'use client';

import { z } from 'zod';
import axios, { type AxiosResponse } from 'axios';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useSettingsStore from '@/hooks/useSettingsStore';

const formSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required.',
    })
    .min(1, {
      message: 'Name is required.',
    }),
  description: z.string().optional(),
  strength: z.number({
    required_error: 'Strength is required.',
  }),
  unit: z.string({
    required_error: 'Unit is required.',
  }),
  dosageForm: z.enum(
    ['capsule', 'injection', 'liquid', 'suppository', 'tablet', 'topical'],
    {
      required_error: 'Dosage form is required.',
    }
  ),
  routeOfAdministration: z.enum(
    [
      'inhalation',
      'intramuscular',
      'intravenous',
      'nasal',
      'ophthalmic',
      'oral',
      'rectal',
      'subcutaneous',
      'transdermal',
      'vaginal',
    ],
    {
      required_error: 'Route of administration is required.',
    }
  ),
});

const dosageForms = [
  {
    label: 'Capsule',
    value: 'capsule',
  },
  {
    label: 'Injection',
    value: 'injection',
  },
  {
    label: 'Liquid',
    value: 'liquid',
  },
  {
    label: 'Suppository',
    value: 'suppository',
  },
  {
    label: 'Tablet',
    value: 'tablet',
  },
  {
    label: 'Topical',
    value: 'topical',
  },
];

const routesOfAdministration = [
  {
    label: 'Inhalation',
    value: 'inhalation',
  },
  {
    label: 'Intramuscular',
    value: 'intramuscular',
  },
  {
    label: 'Intravenous',
    value: 'intravenous',
  },
  {
    label: 'Nasal',
    value: 'nasal',
  },
  {
    label: 'Ophthalmic',
    value: 'ophthalmic',
  },
  {
    label: 'Oral',
    value: 'oral',
  },
  {
    label: 'Rectal',
    value: 'rectal',
  },
  {
    label: 'Subcutaneous',
    value: 'subcutaneous',
  },
  {
    label: 'Transdermal',
    value: 'transdermal',
  },
  {
    label: 'Vaginal',
    value: 'vaginal',
  },
];

interface MedicationFormProps {
  currentId?: string | number;
  defaultValues?: z.infer<typeof formSchema>;
}

export default function MedicationForm({
  currentId,
  defaultValues,
}: MedicationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const accessToken = useAccessToken();
  const { closeForm, resetEntity } = useSettingsStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: mutateMedication, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const body = {
        name: values.name,
        description: values.description,
        strength: values.strength,
        unit: values.unit,
        dosageForm: values.dosageForm,
        routeOfAdministration: values.routeOfAdministration,
      };

      if (currentId) {
        return await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/medications/${currentId}`,
          body,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else {
        return await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/medications`,
          body,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    },
    onError: () => {
      return toast({
        title: `Failed to ${currentId ? 'update' : 'create'} medication`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['medications'],
      });

      closeForm();
      resetEntity();

      return toast({
        title: `${currentId ? 'Updated' : 'Created'} medication successfully`,
        description: `Medication has been ${currentId ? 'updated' : 'created'} successfully.`,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => mutateMedication(e))}
        className="space-y-6 px-4 text-foreground"
      >
        <div className="w-full space-y-2">
          {currentId ? (
            <div>
              <h3 className="text-lg font-medium">
                Edit {defaultValues?.name.toLowerCase()}
              </h3>
              <p className="text-sm text-muted-foreground">
                Update the {defaultValues?.name.toLowerCase()} details.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium">New Medication</h3>
              <p className="text-sm text-muted-foreground">
                Add a new medication to the list.
              </p>
            </div>
          )}
          <Separator className="bg-primary/10" />
        </div>
        <div className="flex flex-col gap-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medication Name</FormLabel>
                <FormControl>
                  <Input disabled={isPending} placeholder="MRI" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <FormField
              name="strength"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Strength</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
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
              name="unit"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="mg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <FormField
              name="dosageForm"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Dosage Form</FormLabel>
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
                          placeholder="Select dosage form"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dosageForms.map((item) => (
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
              name="routeOfAdministration"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Route Of Administration</FormLabel>
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
                          placeholder="Select route of administration"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {routesOfAdministration.map((item) => (
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

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isPending}
                    placeholder="Add description..."
                    minRows={4}
                    maxRows={8}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between gap-2">
          <Button type="submit" size="sm" disabled={isPending}>
            {currentId ? 'Update' : 'Create'} Medication
          </Button>
        </div>
      </form>
    </Form>
  );
}
