import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetAllActionQuery {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;
}

export class CreateLogDto {
  userId: string;
  targetId: string;
  targetName: string;
  type: string;
  action: string;
  targetUserId?: string;
  notes?: string;
}
