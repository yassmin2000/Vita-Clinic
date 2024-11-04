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
} from '@nestjs/common';

import { ManufacturersService } from './manufacturers.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateManufacturerDto,
  ManufacturerDto,
  UpdateManufacturerDto,
} from './dto/manufacturers.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Manufacturers',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('settings/manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all manufacturers',
      description: 'Get all manufacturers data',
    },
    okResponse: {
      description: 'Manufacturers data',
      type: [ManufacturerDto],
    },
  })
  @Get()
  async findAll(@Req() request: Request): Promise<ManufacturerDto[]> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.manufacturersService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get manufacturer by ID',
      description: 'Get manufacturer data by ID',
    },
    params: {
      name: 'manufacturerId',
      type: String,
      description: 'Manufacturer ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Manufacturer not found',
    },
    okResponse: {
      description: 'Manufacturer data',
      type: ManufacturerDto,
    },
  })
  @Get(':manufacturerId')
  async getManufacturers(
    @Param('manufacturerId') manufacturerId: string,
    @Req() request: Request,
  ): Promise<ManufacturerDto> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.manufacturersService.findById(manufacturerId);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create manufacturer',
      description: 'Create new manufacturer',
    },
    okResponse: {
      description: 'Manufacturer created',
      type: ManufacturerDto,
    },
  })
  @Post()
  async createManufacturer(
    @Body() createManufacturerDto: CreateManufacturerDto,
    @Req() request: Request,
  ): Promise<ManufacturerDto> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.manufacturersService.create(user.id, createManufacturerDto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update manufacturer',
      description: 'Update manufacturer data',
    },
    params: {
      name: 'manufacturerId',
      type: String,
      description: 'Manufacturer ID',
      example: crypto.randomUUID(),
    },
    okResponse: {
      description: 'Manufacturer updated',
      type: ManufacturerDto,
    },
  })
  @Patch(':manufacturerId')
  async updateManufacturer(
    @Param('manufacturerId') manufacturerId: string,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
    @Req() request: Request,
  ): Promise<ManufacturerDto> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.manufacturersService.update(
      user.id,
      manufacturerId,
      updateManufacturerDto,
    );
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete manufacturer',
      description: 'Delete manufacturer data',
    },
    params: {
      name: 'manufacturerId',
      type: String,
      description: 'Manufacturer ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Manufacturer not found',
    },
    conflictResponse: {
      description: 'Manufacturer is being used by a device',
    },
    okResponse: {
      description: 'Manufacturer deleted',
      type: ManufacturerDto,
    },
  })
  @Delete(':manufacturerId')
  async deleteManufacturer(
    @Param('manufacturerId') manufacturerId: string,
    @Req() request: Request,
  ): Promise<ManufacturerDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.manufacturersService.delete(user.id, manufacturerId);
  }
}
