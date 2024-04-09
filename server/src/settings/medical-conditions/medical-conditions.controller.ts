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
import {
  CreateMedicalConditionDto,
  UpdateMedicalConditionDto,
} from './dto/medical-conditions.dto';
import { MedicalConditionsService } from './medical-conditions.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Payload } from 'src/types/payload.type';

@Controller('settings/medical-conditions')
export class MedicalConditionsController {
  constructor(
    private readonly medicalConditionsService: MedicalConditionsService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async createMedicalCondition(
    @Body() dto: CreateMedicalConditionDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.medicalConditionsService.createMedicalCondition(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return await this.medicalConditionsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getMedicalCondition(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const medicalCondition = await this.medicalConditionsService.findById(id);
    if (!medicalCondition) {
      throw new NotFoundException('Medical Condition not found');
    }

    return medicalCondition;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateMedicalCondition(
    @Param('id') id: string,
    @Body() UpdateMedicalConditionDto: UpdateMedicalConditionDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return await this.medicalConditionsService.updateMedicalCondition(
      id,
      UpdateMedicalConditionDto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteMedicalCondition(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.medicalConditionsService.deleteMedicalCondition(id);
  }
}
