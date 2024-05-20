import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  CreateLaboratoryTestResultDto,
  UpdateLaboratoryTestResultDto,
} from './dto/test-results.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('test-results')
export class TestResultsController {
  constructor(private readonly testResultsService: TestResultsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createTestResults(
    @Body(ValidationPipe) dto: CreateLaboratoryTestResultDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.testResultsService.create(dto, user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateTestResults(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateLaboratoryTestResultDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.testResultsService.update(id, dto, user.id);
  }
}
