import { Module } from '@nestjs/common';
import { EmailOtpService } from './email-otp.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport:{
        host: 'smtp.sendgrid.net',
        auth:{
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      },
      template: {
        dir: join(__dirname, '../src/mail-template'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
  ],
  providers: [EmailOtpService],
  exports: [EmailOtpService]
})
export class EmailOtpModule {}
