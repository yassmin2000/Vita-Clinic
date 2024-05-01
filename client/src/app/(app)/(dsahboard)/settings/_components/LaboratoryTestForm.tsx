'use client';

import { z } from 'zod';
import axios, { type AxiosResponse } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useSettingsStore from '@/hooks/useSettingsStore';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Biomarker } from '@/types/settings.type';

const OPTIONS: Option[] = [
  { label: 'nextjs', value: 'Nextjs' },
  { label: 'React', value: 'react' },
  { label: 'Remix', value: 'remix' },
  { label: 'Vite', value: 'vite' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Ember', value: 'ember', disable: true },
  { label: 'Gatsby', value: 'gatsby', disable: true },
  { label: 'Astro', value: 'astro' },
];

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required.',
    })
    .min(1, {
      message: 'Name is required.',
    }),
  price: z.number({
    required_error: 'Price is required.',
  }),
  biomarkers: z.array(optionSchema).min(0),
  description: z.string().optional(),
});

interface LaboratoryTestFormProps {
  currentId?: string | number;
  defaultValues?: z.infer<typeof formSchema>;
}

export default function LaboratoryTestForm({
  currentId,
  defaultValues,
}: LaboratoryTestFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      biomarkers: defaultValues?.biomarkers || [],
    },
  });
  const accessToken = useAccessToken();
  const { closeForm, resetEntity } = useSettingsStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: biomarkers, isLoading: isLoadingBiomarkers } = useQuery({
    queryKey: ['biomarkers_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/biomarkers`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as Biomarker[];

      if (data) {
        return data.map((biomarker) => ({
          label: biomarker.name,
          value: biomarker.id,
        }));
      }

      return [];
    },
    enabled: !!accessToken,
  });

  const { mutate: mutateLaboratoryTest, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      let response: AxiosResponse<any, any>;
      const body = {
        name: values.name,
        description: values.description,
        price: values.price,
        biomarkers: values.biomarkers.map((biomarker) => biomarker.value),
      };

      if (currentId) {
        response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/laboratory-tests/${currentId}`,
          body,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error('Failed to update');
        }
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/laboratory-tests`,
          body,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status !== 201) {
          throw new Error('Failed to create');
        }
      }

      return response;
    },
    onError: () => {
      return toast({
        title: `Failed to ${currentId ? 'update' : 'create'} laboratory test`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['laboratory-tests'],
      });

      closeForm();
      resetEntity();

      return toast({
        title: `${currentId ? 'Updated' : 'Created'} laboratory test successfully`,
        description: `Laboratory test has been ${currentId ? 'updated' : 'created'} successfully.`,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => mutateLaboratoryTest(e))}
        className="space-y-6 px-4 py-2 text-foreground"
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
              <h3 className="text-lg font-medium">New Laboratory Test</h3>
              <p className="text-sm text-muted-foreground">
                Add a new laboratory test to the list.
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
                <FormLabel required>Laboratory Test Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending || isLoadingBiomarkers}
                    placeholder="Complete Blood Count (CBC)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Price (USD)</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending || isLoadingBiomarkers}
                    type="number"
                    placeholder="100"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="biomarkers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biomarkers</FormLabel>
                <FormControl>
                  <MultipleSelector
                    value={field.value}
                    onChange={field.onChange}
                    defaultOptions={biomarkers}
                    disabled={isPending || isLoadingBiomarkers}
                    placeholder="Select biomarkers for this test..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        No results found.
                      </p>
                    }
                    hidePlaceholderWhenSelected
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isPending || isLoadingBiomarkers}
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
          <Button
            type="submit"
            size="sm"
            disabled={isPending || isLoadingBiomarkers}
          >
            {currentId ? 'Update' : 'Create'} Laboratory Test
          </Button>
        </div>
      </form>
    </Form>
  );
}
