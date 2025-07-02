import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
@ApiTags('auth') // Swagger tag for auth endpoints
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiAcceptedResponse({
    description: 'Returns access token on successful login',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    required: true,
  })
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req: { user: LoginDto }) {
    const { user } = req;
    const result = await this.authService.login(user);
    return {
      message: 'Login successful',
      access_token: result.access_token,
    };
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
}

