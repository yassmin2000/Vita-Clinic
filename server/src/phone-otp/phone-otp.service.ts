import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class PhoneOtpService {
    private readonly client: Twilio;
    constructor() {
    this.client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  async sendSMS(phoneNumber: string, otp: string): Promise<string> {
    try {
      const smsResponse = await this.client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
        body: `Your Vita Clinic code: ${otp}. Use this number to verify your phone number.`,
      });
      console.log(smsResponse.sid);
      return smsResponse.sid;
    } catch (error) {
      error.statusCode = 400;
      throw error;
    }
  }

}
