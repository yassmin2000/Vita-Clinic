import type { Request } from 'express';
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
  ValidationPipe,
} from '@nestjs/common';

import { ServicesService } from './services.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateServiceDto,
  ServiceDto,
  UpdateServiceDto,
} from './dto/services.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Services',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad request',
  },
})
@UseGuards(JwtGuard)
@Controller('settings/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all services',
      description: 'Get all services data',
    },
    okResponse: {
      description: 'Services data',
      type: [ServiceDto],
    },
  })
  @Get()
  async getAllServices(): Promise<ServiceDto[]> {
    return this.servicesService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get service by ID',
      description: 'Get service data by ID',
    },
    params: {
      name: 'serviceId',
      type: String,
      description: 'Service ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Service not found',
    },
    okResponse: {
      description: 'Service data',
      type: ServiceDto,
    },
  })
  @Get(':serviceId')
  async getByID(
    @Param('serviceId') serviceId: string,
    @Req() request: Request,
  ): Promise<ServiceDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const service = await this.servicesService.findById(serviceId);

    return service;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create service',
      description: 'Create service data',
    },
    okResponse: {
      description: 'Service created',
      type: ServiceDto,
    },
  })
  @Post()
  async createService(
    @Body(ValidationPipe) dto: CreateServiceDto,
    @Req() request: Request,
  ): Promise<ServiceDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.servicesService.create(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update service',
      description: 'Service updated',
    },
    params: {
      name: 'serviceId',
      type: String,
      description: 'Service ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Service not found',
    },
    okResponse: {
      description: 'Updated service data',
      type: ServiceDto,
    },
  })
  @Patch(':serviceId')
  async updateService(
    @Param('serviceId') serviceId: string,
    @Body(ValidationPipe) updateServiceDto: UpdateServiceDto,
    @Req() request: Request,
  ): Promise<ServiceDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.servicesService.update(user.id, serviceId, updateServiceDto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete service',
      description: 'Delete service data',
    },
    params: {
      name: 'serviceId',
      type: String,
      description: 'Service ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Service not found',
    },
    conflictResponse: {
      description: 'Service is being used',
    },
    okResponse: {
      description: 'Service deleted',
      type: ServiceDto,
    },
  })
  @Delete(':serviceId')
  async deleteService(
    @Param('serviceId') serviceId: string,
    @Req() request: Request,
  ): Promise<ServiceDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.servicesService.delete(user.id, serviceId);
  }
}
