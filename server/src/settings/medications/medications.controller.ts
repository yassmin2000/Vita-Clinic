import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { MedicationsService } from './medications.service';
import {
  UpdateMedicationDto,
  CreateMedicationDto,
} from './dto/medications.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Payload } from 'src/types/payload.type';

@Controller('settings/medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createMedication(
    @Body() dto: CreateMedicationDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.medicationsService.createMedication(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAllMedications(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return await this.medicationsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getMedication(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const medication = await this.medicationsService.findById(id);
    if (!medication) {
      throw new NotFoundException('Medication not found');
    }

    return medication;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateMedication(
    @Param('id') id: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return await this.medicationsService.updateMedication(
      id,
      updateMedicationDto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteMedication(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.medicationsService.deleteMedication(id);
  }
}
