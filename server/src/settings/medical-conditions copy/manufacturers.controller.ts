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
  CreateManufacturerDto,
  UpdateManufacturerDto,
} from './dto/manufacturers.dto';
import { ManufacturersService } from './manufacturers.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Payload } from 'src/types/payload.type';

@Controller('settings/medical-conditions')
export class ManufacturersController {
  constructor(
    private readonly medicalConditionsService: ManufacturersService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async createMedicalCondition(
    @Body() dto: CreateManufacturerDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }
    return this.medicalConditionsService.createManufacturer(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return await this.medicalConditionsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getMedicalCondition(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
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
    @Body() UpdateMedicalConditionDto: UpdateManufacturerDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return await this.medicalConditionsService.updateManufacturer(
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
