import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req) => {
        const token = req?.headers?.authorization?.split(' ')[1];
        console.log('Extracted JWT:', token);
        return token;
      },
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload);
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
