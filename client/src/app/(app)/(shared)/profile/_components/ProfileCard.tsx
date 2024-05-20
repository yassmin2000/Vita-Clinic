'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { differenceInYears, format, parseISO } from 'date-fns';
import {
  CalendarCheck,
  ClipboardPlus,
  Copy,
  File,
  FileScan,
  Pencil,
  Pill,
  ShieldMinus,
  ShieldPlus,
  TestTubes,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/Icons';
import ActivateModal from '@/components/ActivateModal';
import DeactivateModal from '@/components/DeactivateModal';
import Modal from '@/components/Modal';
import SpecialityForm from '@/app/(app)/(dsahboard)/doctors/_components/SpecialityForm';
import InsuranceForm from '@/app/(app)/(dsahboard)/patients/_components/InsuranceForm';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';
import { capitalize } from '@/lib/utils';

import type { Profile } from '@/types/users.type';

interface ProfileCardProps {
  userId?: string;
}

export default function ProfileCard({ userId }: ProfileCardProps) {
  const { role, isSuperAdmin } = useUserRole();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const [isActivating, setIsActivating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isChangingSpeciality, setIsChangingSpeciality] = useState(false);
  const [isEditingInsurance, setIsEditingInsurance] = useState(false);

  const accessToken = useAccessToken();
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`profile_${userId}`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile${userId ? `/${userId}` : ''}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Profile;
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (userId && error) {
      toast({
        title: 'User not found',
        description: 'The user you are looking for does not exist.',
        variant: 'destructive',
      });

      return router.push('/profile');
    }
  }, [userId, error]);

  if (isLoading || !profile) {
    return (
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
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col items-center gap-4 border-black/5 dark:border-gray-800 sm:flex-row sm:gap-8">
            <Avatar className="h-20 w-20 bg-primary">
              {profile.avatarURL ? (
                <div className="relative aspect-square h-full w-full">
                  <Image
                    src={profile.avatarURL}
                    alt={`${profile.firstName} ${profile.lastName} profile picture`}
                    referrerPolicy="no-referrer"
                    fill
                  />
                </div>
              ) : (
                <AvatarFallback>
                  <span>
                    {profile.firstName[0].toUpperCase() +
                      profile.lastName[0].toUpperCase()}
                  </span>
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-1 flex-col justify-center gap-3">
              <div className="flex flex-col gap-2">
                <h2 className="text-base font-semibold text-primary">
                  {capitalize(profile.role)} Basic Information
                </h2>
                <div className="grid grid-cols-1 place-items-baseline gap-1 sm:grid-cols-2 lg:grid-cols-3">
                  <p>
                    <span className="font-medium text-primary">
                      {capitalize(profile.role)} Name:
                    </span>{' '}
                    {`${profile.firstName} ${profile.lastName}`}
                  </p>

                  <p className="flex items-center gap-0.5">
                    <span className="font-medium text-primary">Age:</span>{' '}
                    {differenceInYears(new Date(), parseISO(profile.birthDate))}{' '}
                    years old.{' '}
                    <span className="text-sm text-muted-foreground">
                      ({format(parseISO(profile.birthDate), 'MMM dd, yyyy')})
                    </span>
                  </p>

                  <p>
                    <span className="font-medium text-primary">Sex:</span>{' '}
                    {capitalize(profile.sex)}
                  </p>

                  <p className="flex items-center gap-1 sm:col-span-2 md:col-span-1">
                    <span className="font-medium text-primary">Email:</span>{' '}
                    {profile.email}{' '}
                    <Button
                      variant="secondary"
                      className="ml-1 h-fit w-fit p-1.5 text-primary hover:text-primary/80"
                      onClick={() =>
                        navigator.clipboard.writeText(profile.email)
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </p>

                  <p className="flex items-center gap-1 sm:col-span-2 md:col-span-1">
                    <span className="font-medium text-primary">SSN:</span>{' '}
                    {profile.ssn}{' '}
                    <Button
                      variant="secondary"
                      className="ml-1 h-fit w-fit p-1.5 text-primary hover:text-primary/80"
                      onClick={() =>
                        navigator.clipboard.writeText(profile.phoneNumber)
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </p>

                  <p className="flex items-center gap-1 sm:col-span-2 md:col-span-1">
                    <span className="font-medium text-primary">
                      Phone Number:
                    </span>{' '}
                    {profile.phoneNumber}{' '}
                    <Button
                      variant="secondary"
                      className="ml-1 h-fit w-fit p-1.5 text-primary hover:text-primary/80"
                      onClick={() =>
                        navigator.clipboard.writeText(profile.phoneNumber)
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </p>

                  <p>
                    <span className="font-medium text-primary sm:col-span-2 md:col-span-1">
                      Address:
                    </span>{' '}
                    {profile.address}
                  </p>

                  {profile.role === 'doctor' && profile.speciality && (
                    <p>
                      <span className="font-medium text-primary">
                        Speciality:
                      </span>{' '}
                      {profile.speciality}
                    </p>
                  )}

                  {profile.role === 'doctor' && (
                    <p className="text-primary">
                      <span className="font-medium">Appointments:</span>{' '}
                      <Link href={`/doctors/${profile.id}/appointments`}>
                        {profile.appointments}
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              {profile.role === 'patient' && profile.insurance && (
                <div className="flex w-full flex-1 flex-col gap-2">
                  <h2 className="text-base font-semibold text-primary">
                    Patient Insurance Information
                  </h2>
                  <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                    <p>
                      <span className="font-medium text-primary">
                        Insurance Provider:
                      </span>{' '}
                      {profile.insurance.provider}
                    </p>

                    <p className="flex items-center gap-0.5">
                      <span className="font-medium text-primary">
                        Insurance Policy Number:
                      </span>{' '}
                      {profile.insurance.policyNumber}
                    </p>

                    <p>
                      <span className="font-medium text-primary">
                        Insurance Policy Start Date:
                      </span>{' '}
                      {format(
                        parseISO(profile.insurance.policyStartDate),
                        'MMM dd, yyyy'
                      )}
                    </p>

                    <p>
                      <span className="font-medium text-primary">
                        Insurance Policy Start Date:
                      </span>{' '}
                      {format(
                        parseISO(profile.insurance.policyEndDate),
                        'MMM dd, yyyy'
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {profile.role === 'patient' && (
            <>
              <Separator className="my-4" />
              <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
                <Link
                  href={
                    role === 'patient' ? '/emr' : `/patients/${profile.id}/emr`
                  }
                  className={buttonVariants({
                    variant: 'secondary',
                    className: 'group flex items-center gap-1',
                  })}
                >
                  <ClipboardPlus className="h-4 w-4 text-primary transition-all group-hover:text-primary/70" />{' '}
                  Electronic Medical Record
                </Link>
                <Link
                  href={
                    role === 'patient'
                      ? '/appointments'
                      : `/patients/${profile.id}/appointments`
                  }
                  className={buttonVariants({
                    variant: 'secondary',
                    className: 'group flex items-center gap-1',
                  })}
                >
                  <CalendarCheck className="h-4 w-4 text-primary transition-all group-hover:text-primary/70" />{' '}
                  Appointments ({profile.appointments})
                </Link>
                <Link
                  href={
                    role === 'patient'
                      ? '/reports'
                      : `/patients/${profile.id}/reports`
                  }
                  className={buttonVariants({
                    variant: 'secondary',
                    className: 'group flex items-center gap-1',
                  })}
                >
                  <File className="h-4 w-4 text-primary transition-all group-hover:text-primary/70" />{' '}
                  Reports ({profile.reports})
                </Link>
                <Link
                  href={
                    role === 'patient'
                      ? '/scans'
                      : `/patients/${profile.id}/scans`
                  }
                  className={buttonVariants({
                    variant: 'secondary',
                    className: 'group flex items-center gap-1',
                  })}
                >
                  <FileScan className="h-4 w-4 text-primary transition-all group-hover:text-primary/70" />{' '}
                  Scans ({profile.scans})
                </Link>
                <Link
                  href={
                    role === 'patient'
                      ? '/test-results'
                      : `/patients/${profile.id}/test-results`
                  }
                  className={buttonVariants({
                    variant: 'secondary',
                    className: 'group flex items-center gap-1',
                  })}
                >
                  <TestTubes className="h-4 w-4 text-primary transition-all group-hover:text-primary/70" />{' '}
                  Laboratory Test Results ({profile.laboratoryTestResults})
                </Link>
                <Link
                  href={
                    role === 'patient'
                      ? '/prescriptions'
                      : `/patients/${profile.id}/prescriptions`
                  }
                  className={buttonVariants({
                    variant: 'secondary',
                    className: 'group flex items-center gap-1',
                  })}
                >
                  <Pill className="h-4 w-4 text-primary transition-all group-hover:text-primary/70" />{' '}
                  Prescriptions ({profile.prescriptions})
                </Link>
                <Link
                  href={
                    role === 'patient'
                      ? '/treatments'
                      : `/patients/${profile.id}/treatments`
                  }
                  className={buttonVariants({
                    variant: 'secondary',
                    className: 'group flex items-center gap-1',
                  })}
                >
                  <Icons.treatment className="h-4 w-4 text-primary transition-all group-hover:text-primary/70" />{' '}
                  Treatments ({profile.treatments})
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center gap-4 self-end">
        {profile.role === 'doctor' && role === 'admin' && (
          <Button
            variant="outline"
            onClick={() => setIsChangingSpeciality(true)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" /> Change Speciality
          </Button>
        )}
        {profile.role === 'patient' && role === 'admin' && (
          <Button
            variant="outline"
            onClick={() => setIsEditingInsurance(true)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" /> Edit Insurance
          </Button>
        )}
        {profile.isActive && !profile.isSuperAdmin && isSuperAdmin && (
          <Button
            variant="destructive"
            onClick={() => setIsDeactivating(true)}
            className="flex items-center gap-2"
          >
            <ShieldMinus className="h-4 w-4" /> Deactivate
          </Button>
        )}
        {!profile.isActive && !profile.isSuperAdmin && isSuperAdmin && (
          <Button
            variant="outline"
            onClick={() => setIsActivating(true)}
            className="flex items-center gap-2"
          >
            <ShieldPlus className="h-4 w-4" /> Activate
          </Button>
        )}
      </div>

      <ActivateModal
        id={profile.id}
        name={`${profile.firstName} ${profile.lastName}`}
        role={profile.role}
        isOpen={isActivating}
        onClose={() => setIsActivating(false)}
        queryKey={`profile_${userId}`}
      />

      <DeactivateModal
        id={profile.id}
        name={`${profile.firstName} ${profile.lastName}`}
        isOpen={isDeactivating}
        onClose={() => setIsDeactivating(false)}
        queryKey={`profile_${userId}`}
      />

      <Modal
        isOpen={isChangingSpeciality}
        onClose={() => setIsChangingSpeciality(false)}
        className="h-fit"
      >
        <SpecialityForm
          doctorId={profile.id}
          doctorName={`${profile.firstName} ${profile.lastName}`}
          doctorSpeciality={profile.specialityId || ''}
          onClose={() => {
            queryClient.invalidateQueries({
              queryKey: [`profile_${userId}`],
            });
            setIsChangingSpeciality(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={isEditingInsurance}
        onClose={() => setIsEditingInsurance(false)}
        className="h-fit"
      >
        <InsuranceForm
          patientId={profile.id}
          isInsuranceExisting={Boolean(profile.insurance)}
          patientName={`${profile.firstName} ${profile.lastName}`}
          defaultValues={
            profile.insurance
              ? {
                  insurancePolicyNumber: profile.insurance.policyNumber,
                  insuranceProvider: profile.insurance.provider,
                  insurancePolicyStartDate: new Date(
                    profile.insurance.policyStartDate
                  ),
                  insurancePolicyEndDate: new Date(
                    profile.insurance.policyEndDate
                  ),
                }
              : undefined
          }
          onClose={() => {
            queryClient.invalidateQueries({
              queryKey: [`profile_${userId}`],
            });
            setIsEditingInsurance(false);
          }}
        />
      </Modal>
    </>
  );
}
