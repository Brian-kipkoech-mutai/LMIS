import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    console.log('provided password hash:', await bcrypt.hash(password, 10));
    user && console.log('user.password:', user.password);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async login(user: any) {
    const payload = {
      sub: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(): Promise<void> {
    // Nothing to do server-side (JWT is stateless).
    // Optional: store blacklisted token if you're implementing blacklist logic.
  }
}
