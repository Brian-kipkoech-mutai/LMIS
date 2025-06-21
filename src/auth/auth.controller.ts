import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    const result = await this.authService.login(req.user);
    return {
      message: 'Login successful',
      access_token: result.access_token,
    };
  }

  @Post('logout')
  async logout() {
    // In a stateless JWT system, logout is handled on the client
    return { message: 'Logout successful (client must discard token)' };
  }
}
