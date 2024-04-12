import {
    Controller,
    Post,
    Body,
    Get,
    Req,
    Query,
    UnauthorizedException,
    UseGuards,
    Patch,
    Param,
    Delete,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { CreateDeviceDto, UpdateDeviceDto } from './dto/devices.dto';
  import { DevicesService } from './devices.service';
  import { JwtGuard } from 'src/auth/guards/jwt.guard';
  import { Payload } from 'src/types/payload.type';
  
  @Controller('settings/devices')
  export class DevicesController {
    constructor(
      private readonly devicesService: DevicesService,
    ) {}
  
    @UseGuards(JwtGuard)
    @Post()
    async createDevice(
      @Body() dto: CreateDeviceDto,
      @Req() request: Request,
    ) {
      const user: Payload = request['user'];
  
      if (user.role !== 'admin') {
        throw new UnauthorizedException();
      }
  
      if (!dto.manufacturerId) {
        throw new BadRequestException('Manufacturer ID is required');
      }
  
      return this.devicesService.createDevice(dto);
    }
  
    @UseGuards(JwtGuard)
    @Get()
    async findAll(@Query() queryParams: any, @Req() request: Request) {
        const user: Payload = request['user'];
    
        if (user.role === 'patient') {
          throw new UnauthorizedException();
        }
    
        const { page = 1, limit = 10, status = 'all', value = '', sort = 'purchaseDate-desc' } = queryParams;
    
        return await this.devicesService.findAll(page, limit, status, value, sort);
      }
  
    @UseGuards(JwtGuard)
    @Get(':id')
    async getDeviceById(@Param('id') id: string, @Req() request: Request) {
      const user: Payload = request['user'];
  
      if (user.role !== 'admin') {
        throw new UnauthorizedException();
      }
  
      const device = await this.devicesService.findById(id);
      if (!device) {
        throw new NotFoundException('Device not found');
      }
  
      return device;
    }
  
    @UseGuards(JwtGuard)
    @Patch(':id')
    async updateDevice(
      @Param('id') id: string,
      @Body() updateDeviceDto: UpdateDeviceDto,
      @Req() request: Request,
    ) {
      const user: Payload = request['user'];
  
      if (user.role !== 'admin') {
        throw new UnauthorizedException();
      }
  
      if (!updateDeviceDto.manufacturerId) {
        throw new BadRequestException('Manufacturer ID is required');
      }
  
      const updatedDevice = await this.devicesService.updateDevice(
        id,
        updateDeviceDto,
      );
  
      if (!updatedDevice) {
        throw new NotFoundException('Device not found');
      }
  
      return updatedDevice;
    }
  
    @UseGuards(JwtGuard)
    @Delete(':id')
    async deleteDevice(@Param('id') id: string, @Req() request: Request) {
      const user: Payload = request['user'];
  
      if (user.role !== 'admin') {
        throw new UnauthorizedException();
      }
  
      const deleted = await this.devicesService.deleteDevice(id);
      if (!deleted) {
        throw new NotFoundException('Device not found');
      }
    }
  }
  