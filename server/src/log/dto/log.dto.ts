import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class GetAllActionQuery {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsIn(['date-desc', 'date-asc'])
  sort?: 'date-desc' | 'date-asc';
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
