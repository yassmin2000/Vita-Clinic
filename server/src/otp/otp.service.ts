import { Injectable } from '@nestjs/common';
import * as randomstring from 'randomstring';

import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, type: 'email' | 'phone') {
    await this.prisma.otp.deleteMany({
      where: {
        userId,
        type,
      },
    });

    const otpString = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });
    let isUniqueOtp = false;

    while (!isUniqueOtp) {
      const existingOtp = await this.prisma.otp.findUnique({
        where: {
          otp: otpString,
        },
      });

      if (!existingOtp) {
        isUniqueOtp = true;
      }
    }

    return this.prisma.otp.create({
      data: {
        otp: otpString,
        type,
        userId,
        expiryDate: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
  }
}
