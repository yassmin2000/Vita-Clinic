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
  name: z.string().min(1, {
    message: 'Title is required.',
  }),
  description: z.string().optional(),
});

interface LookupFormProps {
  title: string;
  endpoint: string;
  queryKey: string;
  placeholder: string;
  currentId?: string;
  defaultValues?: z.infer<typeof formSchema>;
}

export default function LookupForm({
  title,
  endpoint,
  queryKey,
  placeholder,
  currentId,
  defaultValues,
}: LookupFormProps) {
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

      if (currentId) {
        response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}/${currentId}`,
          {
            name: values.name,
            description: values.description,
          },
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
          `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
          {
            name: values.name,
            description: values.description,
          },
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
        title: `Failed to ${currentId ? 'update' : 'create'} ${title.toLowerCase()}`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });

      closeForm();
      resetEntity();

      return toast({
        title: `${currentId ? 'Updated' : 'Created'} ${title.toLowerCase()} successfully`,
        description: `${title} has been ${currentId ? 'updated' : 'created'} successfully.`,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => mutateLookup(e))}
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
              <h3 className="text-lg font-medium">New {title}</h3>
              <p className="text-sm text-muted-foreground">
                Add a new {title.toLowerCase()} to the list.
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
                <FormLabel required>{title} Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder={placeholder}
                    {...field}
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
            {currentId ? 'Update' : 'Create'} {title}
          </Button>
        </div>
      </form>
    </Form>
  );
}
