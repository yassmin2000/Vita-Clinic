import type { Response } from 'express';
import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';

import { PacsService } from './pacs.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { ApiDocumentation } from 'src/decorators/documentation.decorator';
import { ApiQuery } from '@nestjs/swagger';

@ApiDocumentation({
  tags: 'PACS',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('pacs')
export class PacsController {
  constructor(private readonly pacsService: PacsService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get DICOM preview image',
      description: 'Get preview image for DICOM file',
    },
    notFoundResponse: {
      description: 'DICOM file not found at the provided URL',
    },
    okResponse: {
      description: 'Preview image',
      type: 'image',
    },
  })
  @ApiQuery({
    name: 'fileURL',
    type: String,
    description: 'DICOM file URL',
    example: 'https://example.com/dicom.dcm',
    required: true,
  })
  @ApiQuery({
    name: 'extension',
    enum: ['png', 'jpeg'],
    description: 'Image extension',
    example: 'png',
    required: false,
  })
  @Get('preview')
  async getPacsPreview(
    @Query('fileURL') fileURL: string,
    @Query('extension') extension: string,
    @Res() res: Response,
  ): Promise<void> {
    const imageResponse = await this.pacsService.getPreviewImage(
      fileURL,
      extension,
    );

    const contentType = extension === 'png' ? 'image/png' : 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.send(imageResponse.data);
  }
}
