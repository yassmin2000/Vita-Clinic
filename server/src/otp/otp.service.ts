import { Injectable } from '@nestjs/common';
import * as randomstring from 'randomstring';

import { PrismaService } from 'src/prisma.service';
import { EmailOtpService } from 'src/email-otp/email-otp.service';
import { format } from 'date-fns'
import { PhoneOtpService } from 'src/phone-otp/phone-otp.service';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private readonly emailOtpService: EmailOtpService,
    private readonly phoneOtpService: PhoneOtpService,
  ) { }

  async create(userId: string, type: 'email' | 'phone', firstName: string, userEmail: string, phoneNumber: string) {
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
    if (type == 'email') {
      await this.emailOtpService.sendEmailWithTemplate(
        userEmail,
        otpString,
        format(new Date(), 'dd MMM, yyyy'),
        firstName
      );
    }else{
      await this.phoneOtpService.sendSMS(
        phoneNumber,
        otpString,
      );
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
