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

@ApiTags('auth') // Swagger tag for auth endpoints
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
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

    const html = LoginVerificationTemplate.replace('{{OTP_CODE}}', otp).replace(
      '{{YEAR}}',
      new Date().getFullYear().toString(),
    );

    this.authService.saveOtp(otp, user.id); // Save OTP to database
    this.emailService.sendMail(user.email, 'login attempt verification', html);
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

