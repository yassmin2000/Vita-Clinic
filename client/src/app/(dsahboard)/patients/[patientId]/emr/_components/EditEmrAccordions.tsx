'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import GeneralInformationForm from './GeneralInformationForm';
import PatientAllergies from './PatientAllergies';
import PatientDiagnoses from './PatientDiagnoses';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';

import type { EMR } from '@/types/emr.type';
import { useEffect } from 'react';

interface EditEmrAccordionsProps {
  patientId: string;
}

export default function EditEmrAccordions({
  patientId,
}: EditEmrAccordionsProps) {
  const accessToken = useAccessToken();
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
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="flex flex-col">
            <Skeleton key={index} className="h-14 rounded-b-none bg-primary" />
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
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="patient-medical-conditions" className="border-none">
        <AccordionTrigger className="rounded-t-md bg-primary px-4 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:no-underline">
          Patient Medical Conditions
        </AccordionTrigger>
        <AccordionContent className="rounded-b-md border-b-2 border-l-2 border-r-2 border-secondary px-4 py-6 md:px-8"></AccordionContent>
      </AccordionItem>

      <AccordionItem value="patient-surgeries" className="border-none">
        <AccordionTrigger className="rounded-t-md bg-primary px-4 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:no-underline">
          Patient Surgeries
        </AccordionTrigger>
        <AccordionContent className="rounded-b-md border-b-2 border-l-2 border-r-2 border-secondary px-4 py-6 md:px-8"></AccordionContent>
      </AccordionItem>

      <AccordionItem value="patient-medications" className="border-none">
        <AccordionTrigger className="rounded-t-md bg-primary px-4 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:no-underline">
          Patient Medications
        </AccordionTrigger>
        <AccordionContent className="rounded-b-md border-b-2 border-l-2 border-r-2 border-secondary px-4 py-6 md:px-8"></AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
