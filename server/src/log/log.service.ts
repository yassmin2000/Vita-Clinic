import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLogDto, GetAllActionQuery } from './dto/log.dto';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async getAllActions({
    page = 1,
    limit = 10,
    value = '',
    sort = 'date-desc',
  }: GetAllActionQuery) {
    const names = value.trim().split(' ');
    const mode = 'insensitive' as 'insensitive';
    const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];
    const offset = (page - 1) * limit;

    const nameConditions = names.flatMap((name) => [
      {
        user: {
          OR: [
            {
              firstName: {
                contains: name,
                mode,
              },
            },
            {
              lastName: {
                contains: name,
                mode,
              },
            },
          ],
        },
      },
      {
        targetUser: {
          OR: [
            {
              firstName: {
                contains: name,
                mode,
              },
            },
            {
              lastName: {
                contains: name,
                mode,
              },
            },
          ],
        },
      },
    ]);

    return this.prisma.action.findMany({
      where: {
        OR: [
          ...nameConditions,
          {
            targetName: {
              contains: value,
              mode,
            },
          },
        ],
      },
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
      orderBy: {
        createdAt: sortField === 'date' ? sortOrder : undefined,
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
