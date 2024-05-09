'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { differenceInYears, format, parseISO } from 'date-fns';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import GeneralInformationForm from './GeneralInformationForm';
import PatientAllergies from './PatientAllergies';
import PatientDiagnoses from './PatientDiagnoses';
import PatientMedicalConditions from './PatientMedicalConditions';
import PatientSurgeries from './PatientSurgeries';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import PatientMedications from './PatientMedications';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';
import { capitalize } from '@/lib/utils';

import type { EMR } from '@/types/emr.type';

interface EmrAccordionsProps {
  patientId: string;
  view?: boolean;
}

export default function EmrAccordions({
  patientId,
  view = false,
}: EmrAccordionsProps) {
  const accessToken = useAccessToken();
  const { role } = useUserRole();
  const router = useRouter();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: [`emr_${patientId}`],
    queryFn: async () => {
      if (!patientId) {
        return null;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/emr/${patientId}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 404) {
        toast({
          title: 'EMR Not Found',
          description: 'The EMR you are looking for does not exist.',
          variant: 'destructive',
        });
        return router.push('/');
      }

      return response.data as EMR;
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Patient's EMR not found",
        description:
          'The electronic medical record you are looking for does not exist.',
        variant: 'destructive',
      });

      return router.push('/patients');
    }
  }, [error]);

  if (isLoading || !data) {
    return (
      <>
        {role !== 'patient' && (
          <Card className="flex items-center justify-between border-black/5 p-4 transition-all dark:border-gray-800">
            <div className="flex items-center gap-x-4">
              <div className="h-20 w-24">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-4 w-40 sm:w-96" />
                <Skeleton className="h-4 w-[70%]" />
                <Skeleton className="h-4 w-[50%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>
          </Card>
        )}

        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col">
            <Skeleton className="h-14 rounded-b-none bg-primary" />
            {index === 0 && (
              <Skeleton className="h-32 rounded-b-md rounded-t-none border-2 border-t-0 border-secondary bg-background" />
            )}
          </div>
        ))}
      </>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="general-info"
      className="flex w-full flex-col gap-2"
    >
      {role !== 'patient' && (
        <Card className="flex flex-col items-center gap-8 border-black/5 p-4 dark:border-gray-800 sm:flex-row">
          <Avatar className="h-20 w-20 bg-primary">
            {data.patient.avatarURL ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  src={data.patient.avatarURL}
                  alt={`${data.patient.firstName} ${data.patient.lastName} profile picture`}
                  referrerPolicy="no-referrer"
                  fill
                />
              </div>
            ) : (
              <AvatarFallback>
                <span>
                  {data.patient.firstName[0].toUpperCase() +
                    data.patient.lastName[0].toUpperCase()}
                </span>
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-1 flex-col gap-1">
            <h2 className="text-base font-semibold text-primary">
              Patient Basic Information
            </h2>
            <p>
              <span className="font-medium text-primary">Patient Name:</span>{' '}
              {`${data.patient.firstName} ${data.patient.lastName}`}
            </p>

            <p className="flex items-center gap-0.5">
              <span className="font-medium text-primary">Age:</span>{' '}
              {differenceInYears(new Date(), parseISO(data.patient.birthDate))}{' '}
              years old.{' '}
              <span className="text-sm text-muted-foreground">
                ({format(parseISO(data.patient.birthDate), 'MMM dd, yyyy')})
              </span>
            </p>

            <p>
              <span className="font-medium text-primary">Sex:</span>{' '}
              {capitalize(data.patient.sex)}
            </p>
          </div>
        </Card>
      )}

      <AccordionItem value="general-info" className="border-none">
        <AccordionTrigger className="rounded-t-md bg-primary px-4 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:no-underline">
          General Information
        </AccordionTrigger>
        <AccordionContent className="rounded-b-md border-b-2 border-l-2 border-r-2 border-secondary px-4 py-6 sm:px-8">
          <GeneralInformationForm
            patientId={patientId}
            defaultValues={{
              height: data.height,
              weight: data.weight,
              bloodType: data.bloodType,
              smokingStatus: data.smokingStatus,
              alcoholStatus: data.alcoholStatus,
              drugsUsage: data.drugsUsage,
            }}
            view={view}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="patient-allergies" className="border-none">
        <AccordionTrigger className="rounded-t-md bg-primary px-4 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:no-underline">
          Patient Allergies
        </AccordionTrigger>
        <AccordionContent className="rounded-b-md border-b-2 border-l-2 border-r-2 border-secondary px-4 py-6 md:px-8">
          <PatientAllergies
            patientId={patientId}
            patientAllergies={data.allergies}
            view={view}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="patient-diagnoses" className="border-none">
        <AccordionTrigger className="rounded-t-md bg-primary px-4 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:no-underline">
          Patient Diagnoses
        </AccordionTrigger>
        <AccordionContent className="rounded-b-md border-b-2 border-l-2 border-r-2 border-secondary px-4 py-6 md:px-8">
          <PatientDiagnoses
            patientId={patientId}
            patientDiagnoses={data.diagnoses}
            view={view}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="patient-medical-conditions" className="border-none">
        <AccordionTrigger className="rounded-t-md bg-primary px-4 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:no-underline">
          Patient Medical Conditions
        </AccordionTrigger>
        <AccordionContent className="rounded-b-md border-b-2 border-l-2 border-r-2 border-secondary px-4 py-6 md:px-8">
          <PatientMedicalConditions
            patientId={patientId}
            patientMedicalConditions={data.medicalConditions}
            view={view}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="patient-surgeries" className="border-none">
        <AccordionTrigger className="rounded-t-md bg-primary px-4 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:no-underline">
          Patient Surgeries
        </AccordionTrigger>
        <AccordionContent className="rounded-b-md border-b-2 border-l-2 border-r-2 border-secondary px-4 py-6 md:px-8">
          <PatientSurgeries
            patientId={patientId}
            patientSurgeries={data.surgeries}
            view={view}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="patient-medications" className="border-none">
        <AccordionTrigger className="rounded-t-md bg-primary px-4 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:no-underline">
          Patient Medications
        </AccordionTrigger>
        <AccordionContent className="rounded-b-md border-b-2 border-l-2 border-r-2 border-secondary px-4 py-6 md:px-8">
          <PatientMedications
            patientId={patientId}
            patientMedications={data.medications}
            view={view}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
