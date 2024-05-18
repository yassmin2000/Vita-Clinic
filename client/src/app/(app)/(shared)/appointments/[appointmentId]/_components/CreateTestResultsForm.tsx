'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import type { LaboratoryTest } from '@/types/settings.type';

const formSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required.',
    })
    .min(1, {
      message: 'Title is required.',
    }),
  laboratoryTest: z.string({
    required_error: 'Laboratory test is required.',
  }),
  notes: z.string().optional(),
});

interface CreateTestResultsFormProps {
  appointmentId: string;
  onClose: () => void;
  testResultsId?: string;
  defaultValues?: z.infer<typeof formSchema> & {
    values: { biomarkerId: string; value: number }[];
  };
}

export default function CreateTestResultsForm({
  appointmentId,
  onClose,
  testResultsId,
  defaultValues,
}: CreateTestResultsFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [values, setValues] = useState<
    { biomarkerId: string; value: number }[]
  >(defaultValues?.values ? defaultValues.values : []);

  const accessToken = useAccessToken();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title,
      laboratoryTest: defaultValues?.laboratoryTest,
      notes: defaultValues?.notes,
    },
  });

  const { data: laboratoryTests, isLoading: isLoadingLaboratoryTests } =
    useQuery({
      queryKey: ['laboratory_tests_form'],
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

        return data.map((laboratoryTest) => ({
          label: `${laboratoryTest.name}`,
          value: laboratoryTest.id,
          biomarkers: laboratoryTest.biomarkers,
        }));
      },
      enabled: !!accessToken,
    });

  const { mutate: mutateTestResults, isPending } = useMutation({
    mutationFn: async () => {
      const body = {
        title: form.getValues('title'),
        notes: form.getValues('notes'),
        appointmentId,
        laboratoryTestId: form.getValues('laboratoryTest'),
        values,
      };

      if (testResultsId) {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/test-results/${testResultsId}`,
          body,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );

        onClose();
        return response;
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/test-results`,
          body,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );

        onClose();
        return response;
      }
    },
    onError: () => {
      return toast({
        title: `Failed to ${testResultsId ? 'update' : 'create new'} laboratory test results`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      return toast({
        title: `Laboratory test results ${testResultsId ? 'updated' : 'created'} successfully`,
        description: `The laboratory test results have been ${testResultsId ? 'updated' : 'created'} successfully.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`test_results_${appointmentId}`],
      });
    },
  });

  const onSubmit = () => {
    setCurrentStep((step) => step + 1);
  };

  const isLoading = isLoadingLaboratoryTests || isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-4 py-2 text-foreground"
      >
        {currentStep === 1 && (
          <div className="w-full space-y-2">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about the laboratory test results.
              </p>
            </div>
            <Separator className="bg-primary/10" />
            <div className="flex flex-col gap-4 pt-4">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Test Results #1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="laboratoryTest"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Laboratory Test</FormLabel>
                    <FormControl className="flex-1">
                      <Combobox
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select laboratory test..."
                        inputPlaceholder="Search laboratory tests..."
                        disabled={isLoading || Boolean(testResultsId)}
                        options={
                          laboratoryTests
                            ? laboratoryTests.map((test) => ({
                                label: test.label,
                                value: test.value,
                              }))
                            : []
                        }
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
          </div>
        )}

        {currentStep === 2 && (
          <div className="w-full space-y-2">
            <div>
              <h3 className="text-lg font-medium">
                Laboratory Test Results Values
              </h3>
              <p className="text-sm text-muted-foreground">
                Add the laboratory test results values for each biomarker.
              </p>
            </div>
            <Separator className="bg-primary/10" />
            <div className="flex flex-col gap-4 pt-4">
              {laboratoryTests
                ?.find((test) => test.value === form.watch('laboratoryTest'))
                ?.biomarkers.map((biomarker) => (
                  <div key={biomarker.id}>
                    <Label required>
                      {biomarker.name} ({biomarker.unit})
                    </Label>
                    <Input
                      disabled={isLoading}
                      type="number"
                      className="mt-2"
                      placeholder={`${biomarker.minimumValue} - ${biomarker.maximumValue} ${biomarker.unit}`}
                      value={
                        values.find(
                          (value) => value.biomarkerId === biomarker.id
                        )?.value || ''
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        setValues((prev) => {
                          const index = prev.findIndex(
                            (item) => item.biomarkerId === biomarker.id
                          );
                          if (index === -1) {
                            return [
                              ...prev,
                              {
                                biomarkerId: biomarker.id,
                                value: Number(value),
                              },
                            ];
                          }

                          return prev.map((item) =>
                            item.biomarkerId === biomarker.id
                              ? { ...item, value: Number(value) }
                              : item
                          );
                        });
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
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
                if (
                  values.length !==
                  laboratoryTests?.find(
                    (test) => test.value === form.watch('laboratoryTest')
                  )?.biomarkers.length
                ) {
                  return toast({
                    title: `Failed to ${testResultsId ? 'update' : 'create new'} laboratory test results`,
                    description: 'Please fill all the biomarkers values.',
                    variant: 'destructive',
                  });
                } else {
                  mutateTestResults();
                }
              }}
            >
              {testResultsId ? 'Update Test Results' : 'Create Test Results'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
