import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './srategy/jwt.strategy';
import { LocalStrategy } from './srategy/local.strategy';
import { RolesGuard } from './guards/role.guard';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: { expiresIn: config.get('jwt.expiresIn') || '1h' }, // Default to 1 hour if not set
      }),
    }),
    TypeOrmModule.forFeature([Otp]),
    UsersModule,
    EmailModule,
    SmsModule
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [RolesGuard],
})
export class AuthModule {}

