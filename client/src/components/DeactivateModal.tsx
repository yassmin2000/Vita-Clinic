'use client';

import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import DeleteAlert from './DeleteAlert';
import { useToast } from './ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';

interface DeactivateModalProps {
  id: string;
  name: string;
  isOpen: boolean;
  onClose: () => void;
  queryKey: string;
}

export default function DeactivateModal({
  id,
  name,
  isOpen,
  onClose,
  queryKey,
}: DeactivateModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const accessToken = useAccessToken();
  const { mutate: deactivateUser, isPending } = useMutation({
    mutationFn: async () => {
      return await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/deactivate`,
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
        title: `Failed to deactivate user`,
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
        title: `User deactivated successfully`,
        description: 'User can no longer log in and access the system.',
      });
    },
  });

  return (
    <DeleteAlert
      title={`Deactivate ${name} account`}
      description={`Are you sure you want to deactivate ${name} account? This means they will not be able to log in and access the system..`}
      deleteText="Deactivate"
      isOpen={isOpen}
      onClose={onClose}
      onDelete={deactivateUser}
      disabled={isPending}
    />
  );
}
