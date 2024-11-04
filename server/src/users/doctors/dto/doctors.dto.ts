import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSpecialityDto {
  @ApiProperty({
    description: 'Speciality ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  specialityId: string;
}
