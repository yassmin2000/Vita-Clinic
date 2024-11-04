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

import { ModalitiesService } from './modalities.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateModalityDto,
  ModalityDto,
  UpdateModalityDto,
} from './dto/modalities.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Modalities',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad request',
  },
})
@UseGuards(JwtGuard)
@Controller('settings/modalities')
export class ModalitiesController {
  constructor(private readonly modalitiesService: ModalitiesService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all modalities',
      description: 'Get all modalities data',
    },
    okResponse: {
      description: 'Modalities data',
      type: [ModalityDto],
    },
  })
  @Get()
  async getAllModalities(): Promise<ModalityDto[]> {
    return this.modalitiesService.findAll();
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get modality by ID',
      description: 'Get modality data by ID',
    },
    params: {
      name: 'modalityId',
      type: String,
      description: 'Modality ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Modality not found',
    },
    okResponse: {
      description: 'Modality data',
      type: ModalityDto,
    },
  })
  @Get(':modalityId')
  async getByID(
    @Param('modalityId') modalityId: string,
    @Req() request: Request,
  ): Promise<ModalityDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const modality = await this.modalitiesService.findById(modalityId);

    return modality;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create modality',
      description: 'Create a new modality',
    },
    okResponse: {
      description: 'Modality created',
      type: ModalityDto,
    },
  })
  @Post()
  async createModality(
    @Body(ValidationPipe) dto: CreateModalityDto,
    @Req() request: Request,
  ): Promise<ModalityDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.modalitiesService.create(user.id, dto);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update modality',
      description: 'Update modality data',
    },
    params: {
      name: 'modalityId',
      type: String,
      description: 'Modality ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Modality not found',
    },
    okResponse: {
      description: 'Modality updated',
      type: ModalityDto,
    },
  })
  @Patch(':modalityId')
  async updateModality(
    @Param('modalityId') modalityId: string,
    @Body(ValidationPipe) updateModalityDto: UpdateModalityDto,
    @Req() request: Request,
  ): Promise<ModalityDto> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.modalitiesService.update(
      user.id,
      modalityId,
      updateModalityDto,
    );
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete modality',
      description: 'Delete modality data',
    },
    params: {
      name: 'modalityId',
      type: String,
      description: 'Modality ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Modality not found',
    },
    conflictResponse: {
      description: 'Modality is being used in a scan',
    },
    okResponse: {
      description: 'Modality deleted',
      type: ModalityDto,
    },
  })
  @Delete(':modalityId')
  async deleteModality(
    @Param('modalityId') modalityId: string,
    @Req() request: Request,
  ): Promise<ModalityDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.modalitiesService.delete(user.id, modalityId);
  }
}
