import { Module } from '@nestjs/common';

import { PhoneOtpService } from './phone-otp.service';

@Module({
  providers: [PhoneOtpService],
  exports: [PhoneOtpService],
})
export class PhoneOtpModule {}
