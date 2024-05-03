'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios, { type AxiosResponse } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import ImageUpload from '@/components/ImageUpload';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from './ui/combobox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from './ui/use-toast';

import { useUploadThing } from '@/lib/uploadthing';
import useAccessToken from '@/hooks/useAccessToken';
import { cn } from '@/lib/utils';

import type { Device } from '@/types/devices.type';
import type { Lookup } from '@/types/settings.type';

const formSchema = z.object({
  deviceName: z.string().min(1, {
    message: 'Device name is required.',
  }),
  manufacturer: z.string().min(1, {
    message: 'Manufacturer is required.',
  }),
  serialNumber: z.string().min(1, {
    message: 'Serial number is required.',
  }),
  status: z.enum(['active', 'inactive'], {
    required_error: 'Status is required.',
    invalid_type_error: 'Status is invalid.',
  }),
  purchaseDate: z
    .date({
      required_error: 'Purchase date is required.',
    })
    .max(new Date(), {
      message: 'Purchase date cannot be in the future.',
    }),
  price: z.number(),
  description: z.string().optional(),
  image: z.any().optional(),
});

interface DeviceFormProps {
  deviceId?: string;
}

export default function DeviceForm({ deviceId }: DeviceFormProps) {
  const { startUpload } = useUploadThing('imageUploader');
  const accessToken = useAccessToken();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: [`device_${deviceId}`],
    queryFn: async () => {
      if (!deviceId) {
        return null;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/devices/${deviceId}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 404) {
        toast({
          title: 'Device not found',
          description: 'The device you are looking for does not exist.',
          variant: 'destructive',
        });
        return router.push('/devices');
      }

      return response.data as Device;
    },
    enabled: !!accessToken,
  });

  const { data: manufacturers, isLoading: isLoadingManufacturers } = useQuery({
    queryKey: ['manufacturers_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/manufacturers`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as Lookup[];

      if (data) {
        return data.map((manufacturer) => ({
          label: manufacturer.name,
          value: manufacturer.id,
        }));
      }

      return [];
    },
    enabled: !!accessToken,
  });

  const { mutate: mutateDevice, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      let url = '';
      if (values.image && values.image !== data?.imageURL) {
        const res = await startUpload([values.image]);
        if (res) {
          const [fileResponse] = res;
          url = fileResponse.url;
        }
      }

      let response: AxiosResponse<any, any>;
      const body = {
        name: values.deviceName,
        serialNumber: values.serialNumber,
        price: values.price,
        imageURL: url || data?.imageURL,
        manufacturerId: values.manufacturer,
        purchaseDate: values.purchaseDate.toISOString(),
        status: values.status,
        description: values.description,
      };

      if (deviceId) {
        response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/devices/${deviceId}`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/devices`,
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

      return router.back();
    },
    onError: () => {
      return toast({
        title: `Failed to ${deviceId ? 'update' : 'create'} device`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      return toast({
        title: `${deviceId ? 'Updated' : 'Created'} device successfully`,
        description: `Device has been ${deviceId ? 'updated' : 'created'} successfully.`,
      });
    },
  });

  useEffect(() => {
    if (data) {
      form.setValue('deviceName', data.name);
      form.setValue('description', data.description);
      form.setValue('image', data.imageURL);
      form.setValue('manufacturer', data.manufacturer.id);
      form.setValue('price', data.price);
      form.setValue('purchaseDate', new Date(data.purchaseDate));
      form.setValue('serialNumber', data.serialNumber);
      form.setValue('status', data.status);
    }
  }, [data]);

  useEffect(() => {
    if (deviceId && error) {
      toast({
        title: 'Device not found',
        description: 'The device you are looking for does not exist.',
        variant: 'destructive',
      });

      return router.push('/devices');
    }
  }, [deviceId, error]);

  return (
    <div className="mx-auto h-full max-w-3xl space-y-2 p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((e) => mutateDevice(e))}
          className="space-y-8 pb-10 text-foreground"
        >
          <div className="w-full space-y-2">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about the device
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending || isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="deviceName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Device Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || isLoading}
                      placeholder="CT Scanner"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="manufacturer"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Manufacturer</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select manufacturer..."
                      inputPlaceholder="Search manufacturer..."
                      options={manufacturers || []}
                      disabled={
                        isPending || isLoading || isLoadingManufacturers
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="serialNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Serial Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || isLoading}
                      placeholder="XXYYZZ123"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="status"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Device Status</FormLabel>
                  <Select
                    disabled={isPending || isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select device status"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Device Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isPending || isLoading}
                      placeholder="10000"
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
              name="purchaseDate"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel required>Purchase date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'flex h-10 w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick the purchase date</span>
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

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending || isLoading}
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
          <Button type="submit" disabled={isPending || isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
