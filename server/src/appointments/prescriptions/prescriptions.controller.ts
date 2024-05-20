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
import { PrescriptionsService } from './prescriptions.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
} from './dto/prescriptions.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createTreatment(
    @Body(ValidationPipe) createPrescriptionDto: CreatePrescriptionDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.prescriptionsService.create(createPrescriptionDto, user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateTreatment(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePrescriptionDto: UpdatePrescriptionDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'doctor') {
      throw new UnauthorizedException();
    }

    return this.prescriptionsService.update(id, updatePrescriptionDto, user.id);
  }
}
