import { IsDate, IsUUID } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';

import { CreateInsuranceDto } from 'src/users/dto/users.dto';

export class InsuranceDto extends OmitType(CreateInsuranceDto, []) {
  @ApiProperty({
    description: 'Insurance ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'EMR ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  emrId: string;

  @ApiProperty({
    description: 'The date and time the insurance was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the insurance was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
