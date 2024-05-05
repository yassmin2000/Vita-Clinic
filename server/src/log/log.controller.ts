import { Controller, Get, Query, } from '@nestjs/common';
import { LogService } from 'src/log/log.service';


@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  async getAllActions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.logService.getAllActions(page, limit);
  }
}
