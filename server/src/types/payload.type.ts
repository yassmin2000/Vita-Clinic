import type { Role } from '@prisma/client';

export type Payload = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: Role;
  isSuperAdmin: boolean;
  avatar: string;
};
