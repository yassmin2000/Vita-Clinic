import { Role } from '@prisma/client';

export type Payload = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar: string;
};
