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

@Controller('settings/manufacturers')
export class ManufacturersController {
  constructor(
    private readonly manufacturersService: ManufacturersService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async createManufacturer(
    @Body() dto: CreateManufacturerDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }
    return this.manufacturersService.createManufacturer(dto);
  
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return await this.manufacturersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getManufacturers(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    const manufacturer = await this.manufacturersService.findById(id);
    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    return manufacturer;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateManufacturer(
    @Param('id') id: string,
    @Body() dto: UpdateManufacturerDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return await this.manufacturersService.updateManufacturer(
      id,
      UpdateManufacturerDto,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteManufacturer(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.manufacturersService.deleteManufacturer(id);
  }
}
