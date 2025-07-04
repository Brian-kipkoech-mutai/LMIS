import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');

    if (!apiKey) {
      throw new Error(
        'SENDGRID_API_KEY is not defined in the environment variables',
      );
    }
    sgMail.setApiKey(apiKey);
  }

  async sendMail(to: string, subject: string, html: string) {
    console.log(
      'sendgrid_api',
      this.configService.get<string>('SENDGRID_API_KEY'),
    );
    const msg = {
      to,
      from: this.configService.get<string>('SENDGRID_FROM_EMAIL') || '',
      subject,
      html,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
    console.log(`Email sent to ${to} with subject "${subject}"`);
  }
}
