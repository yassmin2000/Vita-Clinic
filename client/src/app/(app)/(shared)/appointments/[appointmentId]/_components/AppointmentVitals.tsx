import { useState } from 'react';
import { Gauge, HeartPulse, Pencil, Thermometer } from 'lucide-react';

import Modal from '@/components/Modal';
import VitalsForm from './VitalsForm';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';

import useUserRole from '@/hooks/useUserRole';
import type { Vitals } from '@/types/appointments.type';

interface AppointmentVitalsProps {
  appointmentId: string;
  vitals: Vitals;
}

export default function AppointmentVitals({
  appointmentId,
  vitals,
}: AppointmentVitalsProps) {
  const { role } = useUserRole();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      <div className="flex w-full flex-wrap items-center justify-between px-6 pt-4">
        <p className="text-xl font-semibold text-primary">
          Patient&apos;s Vitals
        </p>

        {role === 'doctor' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFormOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Update Vitals
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col">
          <span className="font-medium text-primary">Temperature</span>
          <span className="flex items-center gap-1 text-foreground">
            <Thermometer className="h-6 w-6" /> {vitals.temperature || 'XX'}
            <p className="-ml-1 text-sm text-muted-foreground">°C</p>
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-primary">Blood Pressure</span>
          <span className="flex items-center gap-2 text-foreground">
            <Gauge className="h-6 w-6" /> {vitals.systolicBloodPressure || 'XX'}
            /{vitals.diastolicBloodPressure || 'XX'}
            <p className="-ml-1 text-sm text-muted-foreground">mmHg</p>
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-primary">Pulse Rate</span>
          <span className="flex items-center gap-2 text-foreground">
            <HeartPulse className="h-6 w-6" /> {vitals.heartRate || 'XX'}
            <p className="-ml-1 text-sm text-muted-foreground">bpm</p>
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-primary">Oxygen Saturation</span>
          <span className="flex items-center gap-2 text-foreground">
            <Icons.oxygen className="h-6 w-6" />{' '}
            {vitals.oxygenSaturation || 'XX'}
            <p className="-ml-1 text-sm text-muted-foreground">%</p>
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-primary">Respiratory Rate</span>
          <span className="flex items-center gap-2 text-foreground">
            <Icons.lungs className="h-6 w-6" /> {vitals.respiratoryRate || 'XX'}
            <p className="-ml-1 text-sm text-muted-foreground">bpm</p>
          </span>
        </div>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        className="h-fit"
      >
        <VitalsForm
          appointmentId={appointmentId}
          vitalsId={vitals.id}
          onClose={() => setIsFormOpen(false)}
          defaultValues={{
            temperature: vitals.temperature || undefined,
            systolicBloodPressure: vitals.systolicBloodPressure || undefined,
            diastolicBloodPressure: vitals.diastolicBloodPressure || undefined,
            heartRate: vitals.heartRate || undefined,
            respiratoryRate: vitals.respiratoryRate || undefined,
            oxygenSaturation: vitals.oxygenSaturation || undefined,
          }}
        />
      </Modal>
    </div>
  );
}
