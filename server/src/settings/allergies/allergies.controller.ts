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
import { CreateAllergyDto, UpdateAllergyDto } from './dto/allergies.dto';
import { AllergiesService } from './allergies.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Payload } from 'src/types/payload.type';

@Controller('settings/allergies')
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}
  
  @UseGuards(JwtGuard)
  @Post()
  async createAllergy(@Body() dto: CreateAllergyDto, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.allergiesService.createAllergy(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAllergies(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return await this.allergiesService.getAllAllergies();
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateAllergy(
    @Param('id') id: string,
    @Body() updateAllergyDto: UpdateAllergyDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return await this.allergiesService.updateAllergy(id, updateAllergyDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteAllergy(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.allergiesService.deleteAllergy(id);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getAllergy(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const allergy = await this.allergiesService.getAllergyById(id);
    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    return allergy;
  }
}
