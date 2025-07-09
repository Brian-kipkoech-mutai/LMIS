import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

import { Otp } from './entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyOtpDto } from './dto/verify.OTP';
 

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
   
  ) {}

  async validateUser(email: string, password: string) {
    console.log('Validating user with email:', email);
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      console.log('User not found for email:', email);
      // throw new UnauthorizedException('Invalid email or password');
    }
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
    // Update last login time
    this.usersService.updateLastLogin(user.user_id);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(): Promise<void> {
    // Nothing to do server-side (JWT is stateless).
    // Optional: store blacklisted token if you're implementing blacklist logic.
  }

  async saveOtp(code: string, userId: number): Promise<void> {
    const otp = this.otpRepo.create({
      code,
      type: 'email', // Assuming email for now, can be changed based on your logic
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // OTP valid for 5 minutes
      userId,
    });

    await this.otpRepo.save(otp);
  }
  //verfy the otp
  async verifyUserUsingOtp(verifyUserDto: VerifyOtpDto) {
    const otpRecord = await this.otpRepo.findOne({ where: verifyUserDto });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    //continue  to login
    const user = await this.usersService.findById(otpRecord.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    //  delete the OTP record after successful verification
    await this.otpRepo.delete(otpRecord.id);

    //return the jwt token
    return this.login(user);
  }
}
