import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateSpecialityDto {
  @IsString()
  @IsNotEmpty()
  specialityId: string;
}
