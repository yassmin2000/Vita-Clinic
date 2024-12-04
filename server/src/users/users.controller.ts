import type { Request } from 'express';
import {
  Controller,
  UseGuards,
  Req,
  UnauthorizedException,
  Post,
  Body,
  ValidationPipe,
  Patch,
  Param,
  Get,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateUserDto,
  UpdateAvatarDto,
  UpdatePasswordDto,
  UpdateSettingsDto,
} from './dto/users.dto';
import {
  BasicUserDto,
  UpdateUserAvatarResponseDto,
  UpdateUserSettingsResponseDto,
  UserProfileDto,
  UserReturnDto,
} from './dto/users-response.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Users',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get current user profile',
      description:
        'Get current user profile including user data, user role, and basic medical data',
    },
    okResponse: {
      description: 'Current user profile',
      type: UserProfileDto,
    },
  })
  @Get('profile')
  async getUserProfile(@Req() request: Request): Promise<UserProfileDto> {
    const user = request.user;

    return this.userService.findProfileById(user.id, false);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get user profile by user id',
      description:
        'Get certain user profile including user data, user role, and basic medical data',
    },
    params: {
      name: 'userId',
      type: String,
      description: 'User ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'User not found',
    },
    okResponse: {
      description: 'User profile',
      type: UserProfileDto,
    },
  })
  @Get('profile/:userId')
  async getUserProfileById(
    @Param('userId') userId: string,
    @Req() request: Request,
  ): Promise<UserProfileDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.userService.findProfileById(userId, user.isSuperAdmin);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create new user',
      description: 'Create new user with specific role',
    },
    body: {
      description: 'Create user data',
      type: CreateUserDto,
    },
    consumes: 'application/json',
    conflictResponse: {
      description: 'Email/phone number/SSN already exists',
    },
    unprocessableEntityResponse: {
      description: 'Speciality ID is required for doctor role',
    },
    notFoundResponse: {
      description: 'Speciaity not found (If doctor)',
    },
    createdResponse: {
      description: 'New user created',
      type: UserReturnDto,
    },
  })
  @Post()
  async createUser(
    @Body(ValidationPipe) dto: CreateUserDto,
    @Req() request: Request,
  ) {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    if (dto.role === 'admin' && !user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.userService.create(dto, dto.role || 'patient', true, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Deactivate user',
      description: 'Deactivate user by user id',
    },
    params: {
      name: 'userId',
      type: String,
      description: 'User ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'User not found',
    },
    okResponse: {
      description: 'User deactivated',
      type: BasicUserDto,
    },
  })
  @Patch(':userId/deactivate')
  async deactivateUser(
    @Param('userId') userId: string,
    @Req() request: Request,
  ): Promise<BasicUserDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.userService.deactivate(userId, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Activate user',
      description: 'Activate user by user id',
    },
    params: {
      name: 'userId',
      type: String,
      description: 'User ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'User not found',
    },
    okResponse: {
      description: 'User activated',
      type: BasicUserDto,
    },
  })
  @Patch(':userId/activate')
  async activateUser(
    @Param('userId') userId: string,
    @Req() request: Request,
  ): Promise<BasicUserDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.userService.activate(userId, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update current user avatar',
      description: 'Update current user avatar',
    },
    body: {
      description: 'User avatar image data',
      type: UpdateAvatarDto,
    },
    consumes: 'application/json',
    okResponse: {
      description: 'User avatar updated',
      type: UpdateUserAvatarResponseDto,
    },
  })
  @Patch('avatar')
  async updateUserAvatar(
    @Req() request: Request,
    @Body(ValidationPipe) dto: UpdateAvatarDto,
  ): Promise<UpdateUserAvatarResponseDto> {
    const user = request.user;

    return this.userService.updateAvatar(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update current user password',
      description: 'Update current user password',
    },
    body: {
      description: 'User password data',
      type: UpdatePasswordDto,
    },
    consumes: 'application/json',
    conflictResponse: {
      description: 'Current password is incorrect',
    },
    okResponse: {
      description: 'User password updated',
    },
  })
  @Patch('password')
  async updateUserPassword(
    @Req() request: Request,
    @Body(ValidationPipe) dto: UpdatePasswordDto,
  ) {
    const user = request.user;

    return this.userService.updatePassword(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update current user settings',
      description: 'Update current user settings',
    },
    body: {
      description: 'User settings data',
      type: UpdateSettingsDto,
    },
    consumes: 'application/json',
    okResponse: {
      description: 'User settings updated',
      type: UpdateUserSettingsResponseDto,
    },
  })
  @Patch('settings')
  async updateUserSettings(
    @Req() request: Request,
    @Body(ValidationPipe) dto: UpdateSettingsDto,
  ): Promise<UpdateUserSettingsResponseDto> {
    const user = request.user;

    return this.userService.updateSettings(user.id, dto);
  }
}
