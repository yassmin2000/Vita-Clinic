import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLogDto, GetAllActionQuery } from './dto/log.dto';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async getAllActions({ page = 1, limit = 10 }: GetAllActionQuery) {
    const offset = (page - 1) * limit;
    return this.prisma.action.findMany({
      include: {
        user: {
          select: {
            id: true,
            role: true,
            firstName: true,
            lastName: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            role: true,
            firstName: true,
            lastName: true,
          },
        },
      },
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
