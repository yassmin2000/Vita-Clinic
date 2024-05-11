'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import type { Lookup } from '@/types/settings.type';

interface SpecialityFormProps {
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  onClose: () => void;
}

export default function SpecialityForm({
  doctorId,
  doctorName,
  doctorSpeciality,
  onClose,
}: SpecialityFormProps) {
  const accessToken = useAccessToken();
  const { toast } = useToast();

  const [specialityId, setSpecialityId] = useState<string | null>(
    doctorSpeciality
  );

  const { data: specialities, isLoading: isLoadingSpecialities } = useQuery({
    queryKey: ['specialities_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/specialities`,
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

  const { mutate: changeSpeciality, isPending } = useMutation({
    mutationFn: async () => {
      return await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/doctors/${doctorId}/speciality`,
        {
          specialityId,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onError: () => {
      return toast({
        title: `Failed to change speciality`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      onClose();
      return toast({
        title: `Speciality changed successfully`,
        description: `Dr. ${doctorName}'s speciality is now ${specialities?.find((speciality) => speciality.value === specialityId)?.label}.`,
      });
    },
  });

  return (
    <div className="space-y-6 px-4 py-2 text-foreground">
      <div className="w-full space-y-2">
        <div>
          <h3 className="text-xl font-medium">Change Doctor Speciality</h3>
          <p className="text-sm text-muted-foreground">
            Change the speciality of Dr.{' '}
            <span className="font-medium text-primary">{doctorName}</span>.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label required>Speciality</Label>
        <Combobox
          value={specialityId || ''}
          onChange={(value) => setSpecialityId(value)}
          placeholder="Select doctor speciality..."
          inputPlaceholder="Search specialities..."
          options={specialities || []}
          disabled={isPending || isLoadingSpecialities}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          disabled={isPending || isLoadingSpecialities}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={isPending || isLoadingSpecialities}
          onClick={() => changeSpeciality()}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
