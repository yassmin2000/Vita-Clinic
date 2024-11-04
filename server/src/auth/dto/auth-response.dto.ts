import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';

import { UserReturnDto } from 'src/users/dto/users-response.dto';

class BackendTokensDto {
  @ApiProperty({
    description: 'Access token',
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0ZjU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.6xHGur4DedouYRTeMps-TR_r4bXBKuGji0FMkMkSUeg',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Token expiration time',
    type: Number,
    example: new Date().setTime(new Date().getTime() + 5 * 60 * 60 * 1000),
  })
  @IsNumber()
  expiresIn: number;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'User data',
    type: OmitType(UserReturnDto, ['isActive']),
  })
  @Type(() => OmitType(UserReturnDto, ['isActive']))
  user: Omit<UserReturnDto, 'isActive'>;

  @ApiProperty({
    description: 'User backend tokens',
    type: BackendTokensDto,
  })
  @Type(() => BackendTokensDto)
  backendTokens: BackendTokensDto;
}
