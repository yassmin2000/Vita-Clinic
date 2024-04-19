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
  price: z.number({
    required_error: 'Price is required.',
  }),
  description: z.string().optional(),
});

interface BiomarkerFormsProps {
  currentId?: string | number;
  defaultValues?: z.infer<typeof formSchema>;
}

export default function ModalityForm({
  currentId,
  defaultValues,
}: BiomarkerFormsProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const accessToken = useAccessToken();
  const { closeForm, resetEntity } = useSettingsStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: mutateLookup, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      let response: AxiosResponse<any, any>;
      const body = {
        name: values.name,
        description: values.description,
        price: values.price
      };

      if (currentId) {
        response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/modalities/${currentId}`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/settings/modalities`,
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
        title: `Failed to ${currentId ? 'update' : 'create'} modality`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['modalities'],
      });

      closeForm();
      resetEntity();

      return toast({
        title: `${currentId ? 'Updated' : 'Created'} modality successfully`,
        description: `Modality has been ${currentId ? 'updated' : 'created'} successfully.`,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => mutateLookup(e))}
        className="space-y-6 px-4 text-gray-900"
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
              <h3 className="text-lg font-medium">New Modality</h3>
              <p className="text-sm text-muted-foreground">
                Add a new modality to the list.
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
                <FormLabel>Modality Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="MRI"
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
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
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
            {currentId ? 'Update' : 'Create'} Modality
          </Button>
        </div>
      </form>
    </Form>
  );
}
