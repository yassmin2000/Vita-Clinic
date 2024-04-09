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
import { CreateBiomarkerDto, UpdateBiomarkerDto } from './dto/biomarkers.dto';
import { BiomarkersService } from './biomarkers.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Payload } from 'src/types/payload.type';

@Controller('/settings/biomarkers')
export class BiomarkersController {
  constructor(private readonly biomarkersService: BiomarkersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createBiomarker(
    @Body() createBiomarkerDto: CreateBiomarkerDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return await this.biomarkersService.createBiomarker(createBiomarkerDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAllBiomarkers(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return await this.biomarkersService.getAllBiomarkers();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getBiomarkerById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.biomarkersService.getBiomarkerById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateBiomarker(
    @Param('id') id: string,
    @Body() updateBiomarkerDto: UpdateBiomarkerDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const updatedBiomarker = await this.biomarkersService.updateBiomarker(
      id,
      updateBiomarkerDto,
    );

    if (!updatedBiomarker) {
      throw new NotFoundException('Biomarker not found');
    }

    return updatedBiomarker;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteBiomarker(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const deleted = await this.biomarkersService.deleteBiomarker(id);
    if (!deleted) {
      throw new NotFoundException('Biomarker not found');
    }
  }
}
