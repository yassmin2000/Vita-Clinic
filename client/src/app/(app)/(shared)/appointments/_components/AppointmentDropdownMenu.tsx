import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Eye, MoreVertical, X } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import DeleteAlert from '@/components/DeleteAlert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import { cn } from '@/lib/utils';

import type { AppointmentStatus } from '@/types/appointments.type';

interface AppointmentDropdownMenuProps {
  id: string;
  appointmentNumber: number;
  status: AppointmentStatus;
  hasInsurance?: boolean;
  viewOption?: boolean;
  queryKey?: string;
}

export default function AppointmentDropdownMenu({
  id,
  appointmentNumber,
  status,
  hasInsurance = false,
  viewOption = true,
  queryKey,
}: AppointmentDropdownMenuProps) {
  const accessToken = useAccessToken();

  const [currentDoctor, setCurrentDoctor] = useState<string | undefined>(
    undefined
  );
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<
    string | undefined
  >(undefined);

  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['allergies_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/doctors/list`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as {
        id: string;
        firstName: string;
        lastName: string;
      }[];

      if (data) {
        return data.map((doctor) => ({
          label: `${doctor.firstName} ${doctor.lastName}`,
          value: doctor.id,
        }));
      }

      return [];
    },
    enabled: !!accessToken,
  });

  const { mutate: approveAppointment } = useMutation({
    mutationFn: async () => {
      if (!currentDoctor) {
        throw new Error('Please select a doctor to approve the appointment');
      }

      setIsSaving(true);
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/approve`,
        {
          doctorId: currentDoctor,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response;
    },
    onError: () => {
      return toast({
        title: `Failed to approve appointment`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }

      setIsApproving(false);
      return toast({
        title: 'Appointment approved successfully',
        description: `Appointment #${appointmentNumber} has been approved successfully.`,
      });
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const { mutate: completeAppointment } = useMutation({
    mutationFn: async () => {
      if (!currentPaymentMethod) {
        throw new Error('Please select a doctor to approve the appointment');
      }

      setIsSaving(true);
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/complete`,
        {
          billingStatus: currentPaymentMethod,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response;
    },
    onError: () => {
      return toast({
        title: `Failed to complete appointment`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }

      setIsCompleting(false);
      return toast({
        title: 'Appointment completed successfully',
        description: `Appointment #${appointmentNumber} has been completed successfully.`,
      });
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const { mutate: rejectAppointment } = useMutation({
    mutationFn: async () => {
      setIsSaving(true);
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/reject`,
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response;
    },
    onError: () => {
      return toast({
        title: `Failed to reject appointment`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }

      return toast({
        title: 'Appointment rejected successfully',
        description: `Appointment #${appointmentNumber} has been rejected successfully.`,
      });
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const { mutate: cancelAppointment } = useMutation({
    mutationFn: async () => {
      setIsSaving(true);
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/cancel`,
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response;
    },
    onError: () => {
      return toast({
        title: `Failed to cancel appointment`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }

      return toast({
        title: 'Appointment canceled successfully',
        description: `Appointment #${appointmentNumber} has been canceled successfully.`,
      });
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  if (!viewOption && status !== 'pending' && status !== 'approved') {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" disabled={isSaving} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {viewOption && (
            <Link href={`/appointments/${id}`}>
              <DropdownMenuItem asChild>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" /> View Appointment
                </div>
              </DropdownMenuItem>
            </Link>
          )}
          {(status === 'pending' || status === 'approved') && (
            <DropdownMenuSeparator />
          )}
          {status === 'pending' && (
            <>
              <DropdownMenuItem onClick={() => setIsApproving(true)}>
                <Check className="mr-2 h-4 w-4" /> Approve appointment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsRejecting(true)}>
                <X className="mr-2 h-4 w-4" /> Reject appointment
              </DropdownMenuItem>
            </>
          )}
          {status === 'approved' && (
            <>
              <DropdownMenuItem onClick={() => setIsCompleting(true)}>
                <Check className="mr-2 h-4 w-4" /> Mark as completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCanceling(true)}>
                <X className="mr-2 h-4 w-4" /> Cancel appointment
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAlert
        title="Reject Appointment"
        description="Are you sure you want to reject this appointment?"
        deleteText="Reject"
        isOpen={isRejecting}
        onClose={() => setIsRejecting(false)}
        onDelete={() => rejectAppointment()}
      />

      <DeleteAlert
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment?"
        deleteText="Cancel"
        isOpen={isCanceling}
        onClose={() => setIsCanceling(false)}
        onDelete={() => cancelAppointment()}
      />

      <Dialog open={isApproving} onOpenChange={() => setIsApproving(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this appointment?
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label required>Doctor</Label>
            <Select
              disabled={isSaving || isLoadingDoctors}
              value={currentDoctor}
              onValueChange={(value) => {
                setCurrentDoctor(value);
              }}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select doctor for appointment" />
              </SelectTrigger>
              <SelectContent>
                {doctors && doctors.length > 0 && (
                  <>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.value} value={doctor.value}>
                        {doctor.label}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>

            <div className="mt-4 flex items-center gap-4 self-end">
              <Button
                variant="outline"
                onClick={() => setIsApproving(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={() => approveAppointment()}
                disabled={isSaving || isLoadingDoctors}
              >
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleting} onOpenChange={() => setIsCompleting(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete this appointment?
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label required>Payment Method</Label>
            <RadioGroup
              value={currentPaymentMethod}
              onValueChange={(value) => setCurrentPaymentMethod(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid">Paid in cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="insurance"
                  id="insurance"
                  disabled={!hasInsurance}
                />
                <Label
                  htmlFor="insurance"
                  className={cn(!hasInsurance && 'opacity-70')}
                >
                  Covered by insurance
                </Label>
              </div>
            </RadioGroup>

            <div className="mt-4 flex items-center gap-4 self-end">
              <Button
                variant="outline"
                onClick={() => setIsApproving(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={() => completeAppointment()} disabled={isSaving}>
                Complete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
