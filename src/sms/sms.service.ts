import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as FormData from 'form-data';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get authPayload() {
    return {
      apiClientID: this.configService.get<string>('sms.apiClientId'),
      key: this.configService.get<string>('sms.apiKey'),
      secret: this.configService.get<string>('sms.apiSecret'),
    };
  }

  async sendSms(msisdn: string, message: string): Promise<string> {
    const serviceID = this.configService.get<string>('sms.serviceId');
    const endpoint = this.configService.get<string>('sms.sendSmsEndpoint');

    if (!endpoint) {
      this.logger.error('SMS endpoint not configured');
      throw new Error('SMS endpoint not configured');
    }

    const form = new FormData();

    // Required fields
    Object.entries(this.authPayload).forEach(([key, value]) => {
      form.append(key, value ?? '');
    });

    form.append('MSISDN', +msisdn);
    form.append('txtMessage', message);

    if (serviceID) {
      form.append('serviceID', +serviceID);
    }
    try {
      const response = await firstValueFrom(
        this.httpService.post(endpoint, form, {
          headers: form.getHeaders(),
        }),
      );

      const data = response.data;

      if (data.status !== 222) {
        this.logger.error(` Failed to send SMS: ${data.status_message}`);
        throw new Error(`SMS failed: ${data.status_message}`);
      }

      this.logger.log(` SMS sent to ${msisdn}, ID: ${data.unique_id}`);
      return data.unique_id;
    } catch (error: any) {
      this.logger.error(
        ` Error sending SMS to ${msisdn}: ${
          error.response?.data?.status_message || error.message || error
        }`,
      );
      throw error;
    }
  }
}
