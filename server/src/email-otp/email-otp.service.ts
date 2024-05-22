import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailOtpService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailWithTemplate(
    recipient: string,
    otp: string,
    date: string,
    name: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: recipient,
      from: 'muhammad.abdel-al02@eng-st.cu.edu.eg',
      subject: 'Vita Clinic Email Verification',
      template: 'temp',
      context: {
        data: {
          name: name,
          otp: otp,
          date: date,
        },
      },
    });
  }
}
