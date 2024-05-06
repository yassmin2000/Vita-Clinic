import { Request } from 'express';
import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { LogService } from 'src/log/log.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { GetAllActionQuery } from './dto/log.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllActions(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllActionQuery,
  ) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.logService.getAllActions(query);
  }
}
