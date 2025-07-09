import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { EmailService } from 'src/email/email.service';
import { LoginVerificationTemplate } from 'src/config/email.template';
import { VerifyOtpDto } from './dto/verify.OTP';
import { Audit } from 'src/audit/decorators/audit.decorator';
import { AuditAction } from 'src/audit/constants/enums/audit-action.enum';
import { SmsService } from 'src/sms/sms.service';

@ApiTags('auth') // Swagger tag for auth endpoints
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  @ApiOperation({ summary: 'User login' })
  @ApiAcceptedResponse({
    description:
      'Returns the user  id which  will be used  (when sending the otp)',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    required: true,
  })
  @Post('login')
  @UseGuards(AuthGuard('local'))
  @Audit({ action: AuditAction.LOGIN })
  async login(@Request() req: any) {
    const user = req.user; // User object returned by LocalStrategy

    //generates otp
    const otp = this.generateCode();
    // Log the user object for debugging
    console.log('otp generated:', otp);

    const html = LoginVerificationTemplate.replace('{{OTP_CODE}}', otp).replace(
      '{{YEAR}}',
      new Date().getFullYear().toString(),
    );

    this.authService.saveOtp(otp, user.id); // Save OTP to database
    console.log('OTP generated:', otp);
    this.emailService.sendMail(user.email, 'login attempt verification', html);

    console.log('Email sent to:', user.email);
    console.log("user", user);
    if (user.phoneNumber) {
      this.smsService.sendSms(
        user.phoneNumber,
        `[Somalia Livestock Market Portal] Your OTP is ${otp}. It expires in 10 minutes. Do not share this code.`,
      );
      console.log('SMS sent to:', user.phoneNumber);
    } else {
      console.log('User does not have a phone number');
    }

    return user.id;
  }

  @Post('verify-otp')
  @Audit({ action: AuditAction.VERIFY_OTP })
  @ApiOperation({ summary: 'Verify OTP for login' })
  @ApiAcceptedResponse({
    description: 'Returns access token on successful OTP verification',
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyUserUsingOtp(verifyOtpDto);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiAcceptedResponse({
    description: 'Logout successful (client must discard token)',
  })
  @Post('logout')
  async logout() {
    // In a stateless JWT system, logout is handled on the client
    return { message: 'Logout successful (client must discard token)' };
  }

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }
}

