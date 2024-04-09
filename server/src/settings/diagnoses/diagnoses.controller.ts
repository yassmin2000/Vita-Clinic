import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Param,
  Body,
  Req,
  UnauthorizedException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { DiagnosesService } from './diagnoses.service';
import { Payload } from 'src/types/payload.type';
import { CreateDiagnosisDto, UpdateDiagnosisDto } from './dto/diagnoses.dto';

@Controller('settings/diagnoses')
export class DiagnosesController {
  constructor(private readonly diagnosesService: DiagnosesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createDiagnosis(
    @Body() createDiagnosisDto: CreateDiagnosisDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.createDiagnosis(createDiagnosisDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getDiagnoses(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return await this.diagnosesService.getAllDiagnoses();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getDiagnosisById(
    @Param('id') id: string, 
    @Req() request: Request
    ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const diagnosis = await this.diagnosesService.getDiagnosisById(id);
    if (!diagnosis) {
      throw new NotFoundException('diagnosis not found');
    }
    return diagnosis;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateDiagnosis(
    @Param('id') id: string,
    @Body() updateDiagnosisDto: UpdateDiagnosisDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return await this.diagnosesService.updateDiagnosis(id, updateDiagnosisDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteDiagnosis(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.deleteDiagnosis(id);
  }
}
