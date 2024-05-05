import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PhoneOtpService } from './phone-otp.service';

@Module({
  providers: [PhoneOtpService],
  exports: [PhoneOtpService]
})
export class PhoneOtpModule {}
