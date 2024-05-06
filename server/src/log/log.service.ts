import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Action } from '@prisma/client';
import { CreateLogDto, GetAllActionQuery } from './dto/log.dto';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async getAllActions({ page = 1, limit = 10 }: GetAllActionQuery) {
    const offset = (page - 1) * limit;
    return this.prisma.action.findMany({
      skip: offset,
      take: limit,
    });
  }

  async create(createLogDto: CreateLogDto) {
    return this.prisma.action.create({
      data: createLogDto,
    });
  }
}
