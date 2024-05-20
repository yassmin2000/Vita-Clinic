'use client';

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import DeleteAlert from './DeleteAlert';
import { useToast } from './ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';

interface ActivateModalProps {
  id: string;
  name: string;
  role: string;
  isOpen: boolean;
  onClose: () => void;
  queryKey: string;
}

export default function ActivateModal({
  id,
  name,
  role,
  isOpen,
  onClose,
  queryKey,
}: ActivateModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const accessToken = useAccessToken();
  const { mutate: activateUser, isPending } = useMutation({
    mutationFn: async () => {
      return await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/activate`,
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onError: () => {
      return toast({
        title: `Failed to activate user`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
      onClose();

      return toast({
        title: `User activated successfully`,
        description: 'User can now log in and access the system.',
      });
    },
  });

  return (
    <DeleteAlert
      title={`Activate ${name} account`}
      description={`Are you sure you want to activate ${name} account? This means they will be able to log in and access the system as ${role}.`}
      deleteText="Activate"
      isOpen={isOpen}
      onClose={onClose}
      onDelete={activateUser}
      disabled={isPending}
    />
  );
}
