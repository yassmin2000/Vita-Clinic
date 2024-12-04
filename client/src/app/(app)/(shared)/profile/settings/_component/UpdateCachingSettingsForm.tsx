'use client';

import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import FormSlider from '@/components/ui/form-slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const formSchema = z.object({
  enableDicomCaching: z.boolean(),
  enableDicomCompression: z.boolean(),
  enableDicomCleanup: z.boolean(),
  cleanupDuration: z.number().min(1).max(60),
});

interface UpdateCachingSettingsFormProps {
  settings: {
    enableDicomCaching: boolean;
    enableDicomCompression: boolean;
    enableDicomCleanup: boolean;
    cleanupDuration: number;
  };
}

export default function UpdateCachingSettingsForm({
  settings,
}: UpdateCachingSettingsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...settings,
    },
  });

  const { data: session, update } = useSession();
  const accessToken = useAccessToken();
  const { toast } = useToast();

  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const body = {
        enableDicomCaching: values.enableDicomCaching,
        enableDicomCompression: values.enableDicomCompression,
        enableDicomCleanup: values.enableDicomCleanup,
        cleanupDuration: values.cleanupDuration,
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/settings`,
        body,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to update settings');
      }

      if (session) {
        await update({
          ...session,
        });
      }

      return response;
    },
    onError: () => {
      return toast({
        title: 'Failed to update settings',
        description:
          'An error occurred while updating your settings, please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      return toast({
        title: 'Settings updated successfully',
        description: 'Your settings has been updated successfully.',
      });
    },
  });

  return (
    <Card>
      <CardContent className="py-4">
        <h4 className="mb-3 text-lg font-semibold">DICOM Caching Settings</h4>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit((e) => updateSettings(e))}
          >
            <FormField
              control={form.control}
              name="enableDicomCaching"
              render={({ field }) => (
                <FormItem className="mt-4 flex items-center gap-2">
                  <FormControl>
                    <Switch
                      className="-mb-2"
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        if (!value) {
                          form.setValue('enableDicomCompression', false);
                          form.setValue('enableDicomCleanup', false);
                        }
                      }}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormLabel>Enable DICOM Files Caching</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        <p className="text-sm text-muted-foreground">
                          This setting allows you to specify whether the DICOM
                          files should be stored in the cache or not. It is
                          recommended to enable this setting to improve the
                          performance of the application, especially for
                          frequently accessed files.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableDicomCompression"
              render={({ field }) => (
                <FormItem className="mt-4 flex items-center gap-2">
                  <FormControl>
                    <Switch
                      className="-mb-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!form.watch('enableDicomCaching') || isPending}
                    />
                  </FormControl>
                  <FormLabel>Enable DICOM Files Compression</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        <p className="text-sm text-muted-foreground">
                          This setting allows you to specify whether the DICOM
                          files should be compressed before they are stored in
                          the cache or not. It is recommended to enable this
                          setting to reduce the storage space used by the DICOM
                          files, but it may increase the processing time for the
                          files, especially for low-end devices and high quality
                          images.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enableDicomCleanup"
              render={({ field }) => (
                <FormItem className="mt-4 flex items-center gap-2">
                  <FormControl>
                    <Switch
                      className="-mb-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!form.watch('enableDicomCaching') || isPending}
                    />
                  </FormControl>
                  <FormLabel>Enable DICOM Files Cleanup</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        <p className="text-sm text-muted-foreground">
                          This setting allows you to specify whether the DICOM
                          files should be automatically removed from the cache
                          after a certain duration or not. It is recommended to
                          enable this setting to prevent the cache from getting
                          filled up with unnecessary files, especially with low
                          storage capacity.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormItem>
              )}
            />

            {form.watch('enableDicomCleanup') && (
              <FormField
                control={form.control}
                name="cleanupDuration"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="cleanupDuration">
                        DICOM Files Cleanup Duration
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <p className="text-sm text-muted-foreground">
                              This setting allows you to specify the duration
                              for which the DICOM files will be stored in the
                              cache before they are automatically removed.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormSlider
                      id="cleanupDuration"
                      min={1}
                      max={60}
                      disabled={isPending}
                      value={field.value}
                      onChange={(value) => field.onChange(+value)}
                      unit="Days"
                    />
                  </FormItem>
                )}
              />
            )}

            <div className="mt-2 flex items-center gap-2 self-end">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => {
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
