import { Request } from 'express';
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

import { VitalsService } from './vitals.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { CreateVitalsDto, UpdateVitalsDto } from './dto/vitals.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('vitals')
export class VitalsController {}
