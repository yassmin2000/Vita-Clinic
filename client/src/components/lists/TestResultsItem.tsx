'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Info, Pencil, Plus } from 'lucide-react';

import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Modal from '../Modal';
import CreateTestResultsForm from '@/app/(app)/(shared)/appointments/[appointmentId]/_components/CreateTestResultsForm';
import { Separator } from '../ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

import useUserRole from '@/hooks/useUserRole';
import type { TestResult } from '@/types/appointments.type';

interface TestResultsItemProps {
  testResults: TestResult;
}

export default function TestResultsItem({ testResults }: TestResultsItemProps) {
  const { role } = useUserRole();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="col-span-1 divide-y divide-accent rounded-lg transition-all hover:shadow-lg dark:shadow-white/10">
      <div className="truncate px-4 pt-6">
        <div className="flex flex-col gap-0.5">
          <h3 className="truncate text-lg font-medium">{testResults.title}</h3>
          <span className="mt-0.5 truncate">
            {testResults.laboratoryTest.name}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-6 px-6 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(testResults.createdAt), 'dd MMM yyyy')}
        </div>
        <span />

        <div className="flex gap-1">
          {role && role === 'doctor' && (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 sm:mr-2" />
              <span className="sr-only sm:not-sr-only">Edit</span>
            </Button>
          )}
          <Button size="sm" onClick={() => setIsDetailsOpen(true)}>
            <Info className="h-4 w-4 sm:mr-2" />
            <span className="sr-only sm:not-sr-only">Details</span>
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        className="h-fit md:overflow-y-auto"
      >
        <div className="space-y-6 px-4 py-2 text-foreground">
          <div className="w-full space-y-2">
            <div>
              <h3 className="text-lg font-medium">
                Laboratory Test Results Details
              </h3>
              <p className="text-sm text-muted-foreground">
                Details of the laboratory test results
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Title</p>
              <p>{testResults.title}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-medium text-primary">Laboratory Test</p>
              <p>{testResults.laboratoryTest.name}</p>
            </div>

            {testResults.laboratoryTest.description && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">
                  Laboratory Test Description
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: testResults.laboratoryTest.description.replace(
                      /\n/g,
                      '<br />'
                    ),
                  }}
                />
              </div>
            )}

            {testResults.values.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Biomarkers Values</p>
                <div className="grid grid-cols-2 gap-1">
                  {testResults.values.map((value) => (
                    <div key={value.id} className="flex flex-col gap-1">
                      <p className="flex items-center text-primary">
                        {value.biomarker.name}
                        {value.biomarker.description && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="ml-1 h-3 w-3" />
                              </TooltipTrigger>
                              <TooltipContent>
                                {value.biomarker.name}:{' '}
                                {value.biomarker.description}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </p>
                      <p>
                        {value.value} {value.biomarker.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {testResults.notes && (
              <div className="flex flex-col gap-1">
                <p className="font-medium text-primary">Additional Notes</p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: testResults.notes.replace(/\n/g, '<br />'),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        className="h-fit overflow-y-auto px-6 py-8"
      >
        <CreateTestResultsForm
          appointmentId={testResults.appointmentId}
          onClose={() => setIsEditing(false)}
          testResultsId={testResults.id}
          defaultValues={{
            title: testResults.title,
            laboratoryTest: testResults.laboratoryTestId,
            notes: testResults.notes,
            values: testResults.values.map((value) => ({
              biomarkerId: value.biomarker.id,
              value: value.value,
            })),
          }}
        />
      </Modal>
    </Card>
  );
}
