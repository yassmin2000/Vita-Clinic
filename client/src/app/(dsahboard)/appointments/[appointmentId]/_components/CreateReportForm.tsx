'use client';

import { useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { useUploadThing } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  reportName: z.string().min(1, {
    message: 'Report name is required.',
  }),
  notes: z.string().optional(),
});

interface CreateReportFormProps {
  onClose: () => void;
}

export default function CreateReportForm({ onClose }: CreateReportFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const { startUpload } = useUploadThing('pdfUploader');
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;

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

  const handleUpload = async (file: File) => {
    console.log(file);
    setIsUploading(true);
    const progressInterval = startSimulateProgress();

    const res = await startUpload([file]);

    if (!res) {
      return console.log('Failed to upload');
    }

    const [fileResponse] = res;

    clearInterval(progressInterval);
    setProgressValue(100);

    return fileResponse;
  };

  const [currentStep, setCurrentStep] = useState(1);

  const onSubmit = () => {
    setCurrentStep((step) => step + 1);
  };

  const createReport = async () => {
    if (!file) {
      setFileError(true);
      return;
    }

    setIsSaving(true);
    const uploadedFile = await handleUpload(file);

    if (uploadedFile) {
      const body = {
        name: form.getValues('reportName'),
        notes: form.getValues('notes'),
        file: uploadedFile.url,
      };
      // Save the report to the database via an API call
      setIsSaving(false);
      onClose();
    } else {
      setIsSaving(false);
      console.log('Something went wrong');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-2">
        {currentStep === 1 && (
          <>
            <div className="w-full space-y-2">
              <div>
                <h3 className="text-lg font-medium">General Information</h3>
                <p className="text-sm text-muted-foreground">
                  General information about the report
                </p>
              </div>
              <Separator className="bg-primary/10" />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                name="reportName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Report Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Report #1"
                        {...field}
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
            multiple={false}
            disabled={isUploading}
            onDropAccepted={(files) => setFile(files[0])}
            accept={{ 'application/pdf': ['.pdf'] }}
          >
            {({ getRootProps, acceptedFiles }) => (
              <div className="flex flex-col gap-2">
                <FormLabel
                  className={cn(
                    'text-xl font-semibold',
                    fileError && 'text-destructive'
                  )}
                >
                  Report File
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
                        <p className="text-xs text-zinc-500">PDF files</p>
                      </div>

                      {acceptedFiles && acceptedFiles[0] && (
                        <div className="flex flex-col gap-2">
                          <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200">
                            <div className="grid h-full place-items-center px-3 py-2">
                              <File className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="h-full truncate px-3 py-2 text-sm">
                              {acceptedFiles[0].name}
                            </div>
                          </div>
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
                  <FormMessage>Report file is required</FormMessage>
                )}
              </div>
            )}
          </Dropzone>
        )}

        <div className="flex justify-between gap-2">
          <Button
            type="button"
            size="sm"
            disabled={currentStep === 1 || isSaving}
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
              disabled={isSaving}
              onClick={() => {
                if (!file) {
                  setFileError(true);
                } else {
                  setFileError(false);
                  createReport();
                }
              }}
            >
              Create Report
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
