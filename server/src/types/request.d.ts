import type { Payload } from './payload.type';

declare module 'express' {
  export interface Request {
    user: Payload;
  }
}
