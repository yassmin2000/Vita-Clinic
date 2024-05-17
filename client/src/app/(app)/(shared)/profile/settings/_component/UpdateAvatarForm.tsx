'use client';

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Trash2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import { useUploadThing } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';

interface UpdateAvatarFormProps {
  avatar?: string;
  firstName: string;
  lastName: string;
}

export default function UpdateAvatarForm({
  avatar,
  firstName,
  lastName,
}: UpdateAvatarFormProps) {
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(
    avatar || null
  );
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const { startUpload } = useUploadThing('imageUploader');
  const { toast } = useToast();
  const { data: session, update } = useSession();

  const accessToken = useAccessToken();
  const { mutate: updateAvatar, isPending } = useMutation({
    mutationFn: async () => {
      let url = '';
      if (currentFile) {
        const res = await startUpload([currentFile]);
        if (res) {
          const [fileResponse] = res;
          url = fileResponse.url;
        }
      }

      const body = {
        avatarURL: url || undefined,
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/avatar`,
        body,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to update avatar');
      }

      if (session) {
        await update({
          ...session,
        });
      }

      return response;
    },
    onError: () => {
      return toast({
        title: 'Failed to update avatar',
        description: 'Failed to update your avatar, please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      return toast({
        title: 'Avatar updated successfully',
        description: 'Your avatar has been updated successfully.',
      });
    },
  });

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 py-4">
        <h4 className="mb-1 text-lg font-semibold">Avatar</h4>
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 bg-primary">
            {currentAvatar ? (
              <div className="group relative aspect-square h-full w-full">
                <Image
                  src={currentAvatar}
                  alt="Profile picture"
                  referrerPolicy="no-referrer"
                  fill
                />
                <div
                  className="relative h-full w-full cursor-pointer bg-black opacity-0 transition-all duration-300 group-hover:opacity-60"
                  onClick={() => {
                    if (!isPending) {
                      setCurrentAvatar(null);
                      setCurrentFile(null);
                    }
                  }}
                >
                  <Trash2 className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform text-destructive " />
                </div>
              </div>
            ) : (
              <AvatarFallback>
                <span className="text-2xl font-medium">
                  {firstName[0].toUpperCase() + lastName[0].toUpperCase()}
                </span>
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col items-start gap-1">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar"
              disabled={isPending}
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setCurrentFile(file);
                  setCurrentAvatar(URL.createObjectURL(file));
                }
              }}
            />
            <label
              className={buttonVariants({
                variant: 'outline',
                className: cn(!isPending && 'cursor-pointer'),
              })}
              htmlFor="avatar"
            >
              Upload
            </label>

            <p className="text-sm text-muted-foreground">
              Upload a new profile picture
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => {
              setCurrentAvatar(avatar || null);
              setCurrentFile(null);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isPending} onClick={() => updateAvatar()}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
