'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Dropzone from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Cloud, File } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

import { useUploadThing } from '@/lib/uploadthing';
import useAccessToken from '@/hooks/useAccessToken';
import { cn } from '@/lib/utils';

import type { PriceLookup } from '@/types/settings.type';

const formSchema = z.object({
  title: z
    .string({
      required_error: 'Scan name is required.',
    })
    .min(1, {
      message: 'Scan name is required.',
    }),
  modality: z.string({
    required_error: 'Modality is required.',
  }),
  notes: z.string().optional(),
});

interface CreateScanFormProps {
  appointmentId: string;
  onClose: () => void;
}

export default function CreateScanForm({
  appointmentId,
  onClose,
}: CreateScanFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const { startUpload } = useUploadThing('dicomUploader');
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
        label: `${modality.name}`,
        value: modality.id,
      }));
    },
    enabled: !!accessToken,
  });

  const { mutate: createScan, isPending } = useMutation({
    mutationFn: async () => {
      if (files.length === 0) {
        setFileError(true);
        return;
      }

      const scanURLs = await handleUpload(files);

      const body = {
        title: form.getValues('title'),
        notes: form.getValues('notes'),
        scanURLs: scanURLs.map((url) => url.replace('https://', 'dicomweb://')),
        appointmentId,
        modalityId: form.getValues('modality'),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/scans`,
        body,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      onClose();
      return response;
    },
    onError: () => {
      return toast({
        title: `Failed to create new scan`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      return toast({
        title: `Scan created successfully`,
        description: 'The scan has been created successfully.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`scans_${appointmentId}`],
      });
    },
  });

  const startSimulateProgress = () => {
    setProgressValue(0);

    const interval = setInterval(() => {
      setProgressValue((value) => {
        if (value >= 95) {
          clearInterval(interval);
          return value;
        }
        return value + 5;
      });
    }, 500);

    return interval;
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    const progressInterval = startSimulateProgress();

    const res = await startUpload(files);

    if (!res) {
      throw new Error('Failed to upload');
    }

    clearInterval(progressInterval);
    setProgressValue(100);

    return res.map((file) => file.url);
  };

  const onSubmit = () => {
    setCurrentStep((step) => step + 1);
  };

  const isLoading = isLoadingModalities || isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-2 text-foreground"
      >
        {currentStep === 1 && (
          <>
            <div className="w-full space-y-2">
              <div>
                <h3 className="text-lg font-medium">General Information</h3>
                <p className="text-sm text-muted-foreground">
                  General information about the scan
                </p>
              </div>
              <Separator className="bg-primary/10" />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Scan Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Scan #1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="modality"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Modality</FormLabel>
                    <FormControl className="flex-1">
                      <Combobox
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select modality..."
                        inputPlaceholder="Search modality..."
                        options={modalities || []}
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
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        placeholder="Add notes..."
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
          </>
        )}

        {currentStep === 2 && (
          <Dropzone
            multiple={true}
            disabled={isUploading}
            onDropAccepted={(files) =>
              setFiles(
                files.sort((a, b) => {
                  const regex = /(\d+)/g;
                  const matchA = a.name.match(regex);
                  const matchB = b.name.match(regex);
                  const numA = matchA ? parseInt(matchA[0]) : 0;
                  const numB = matchB ? parseInt(matchB[0]) : 0;
                  if (numA < numB) {
                    return -1;
                  } else if (numA > numB) {
                    return 1;
                  } else {
                    return a.name.localeCompare(b.name);
                  }
                })
              )
            }
          >
            {({ getRootProps, acceptedFiles }) => (
              <div className="flex flex-col gap-2">
                <FormLabel
                  className={cn(
                    'text-xl font-semibold',
                    fileError && 'text-destructive'
                  )}
                >
                  Scan Files
                </FormLabel>
                <div
                  {...getRootProps()}
                  className="h-64 rounded-lg border border-dashed border-gray-300"
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <label
                      htmlFor="dropzone-file"
                      className={cn(
                        'flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 transition-colors hover:bg-gray-100',
                        isUploading && 'cursor-default'
                      )}
                    >
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <Cloud className="mb-2 h-6 w-6 text-zinc-500" />
                        <p className="mb-2 text-sm text-zinc-700">
                          <span className="font-semibold">Click to upload</span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-zinc-500">DICOM files</p>
                      </div>

                      {acceptedFiles && acceptedFiles.length > 0 && (
                        <div className="mb-2 space-y-2 overflow-y-auto">
                          {files.map((file) => (
                            <div
                              key={file.name}
                              className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200"
                            >
                              <div className="grid h-full place-items-center px-3 py-2">
                                <File className="h-4 w-4 text-blue-500" />
                              </div>
                              <div className="h-full truncate px-3 py-2 text-sm">
                                {file.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {isUploading && (
                        <div className="mx-auto mt-4 w-full max-w-xs">
                          <Progress
                            value={progressValue}
                            indicatorColor={
                              progressValue === 100
                                ? 'bg-green-500'
                                : 'bg-primary'
                            }
                            className="h-1 w-full bg-zinc-200"
                          />
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                {fileError && (
                  <FormMessage>Scan files are required</FormMessage>
                )}
              </div>
            )}
          </Dropzone>
        )}

        <div className="flex justify-between gap-2">
          <Button
            type="button"
            size="sm"
            disabled={currentStep === 1 || isLoading}
            onClick={() => setCurrentStep((step) => step - 1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft />
            Previous
          </Button>

          {currentStep === 1 ? (
            <Button
              type="submit"
              size="sm"
              className="flex items-center gap-2 px-5"
            >
              Next
              <ArrowRight />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={isLoading}
              onClick={() => {
                if (files.length === 0) {
                  setFileError(true);
                } else {
                  setFileError(false);
                  createScan();
                }
              }}
            >
              Create Scan
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
