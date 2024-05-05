import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Action } from '@prisma/client'; 

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async getAllActions(page: number = 1, limit: number = 10): Promise<Action[]> {
    const offset = (page - 1) * limit;
    return this.prisma.action.findMany({
      skip: offset,
      take: limit,
    });
  }

  async create(
    userId: string,
    targetId: string,
    targetName: string,
    type: string, 
    action: string, 
    notes?: string  
  ) {
    return this.prisma.action.create({
      data: {
        userId,
        targetId,
        targetName,
        type,
        action,
        notes,
      },
    });
  }
}