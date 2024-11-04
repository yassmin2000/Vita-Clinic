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

import { LogService } from 'src/log/log.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { GetAllActionQuery, LogDto } from './dto/log.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Log',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @ApiDocumentation({
    operation: {
      description: 'Get all actions',
      summary: 'Get all actions log',
    },
    okResponse: {
      description: 'Actions log data',
      type: [LogDto],
    },
  })
  @Get()
  async getAllActions(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllActionQuery,
  ): Promise<LogDto[]> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.logService.getAllActions(query);
  }
}
