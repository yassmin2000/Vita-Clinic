import type { Request } from 'express';
import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from '../users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { GetAllUsersQuery } from '../dto/users.dto';

import { ApiDocumentation } from 'src/decorators/documentation.decorator';
import { UserListItemDto } from '../dto/users-response.dto';

@ApiDocumentation({
  tags: 'Admins',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('/users/admins')
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all admins',
      description: 'Get all admins data',
    },
    okResponse: {
      description: 'All admins data',
      type: [UserListItemDto],
    },
  })
  @Get()
  async getAllAdmins(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllUsersQuery,
  ): Promise<UserListItemDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.usersService.findAll(user.isSuperAdmin, 'admin', {
      ...query,
    });
  }
}
