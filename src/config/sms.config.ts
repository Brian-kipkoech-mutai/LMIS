import { registerAs } from '@nestjs/config';

export default registerAs('sms', () => ({
  apiClientId: process.env.SMS_API_CLIENT_ID,
  apiKey: process.env.SMS_API_KEY,
  apiSecret: process.env.SMS_API_SECRET,
  serviceId: process.env.SMS_SERVICE_ID,
  sendSmsEndpoint: process.env.SEND_SMS_ENDPOINT,
}));