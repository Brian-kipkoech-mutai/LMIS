import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';



export class VerifyOtpDto {
  @ApiProperty({
    description: 'The OTP code to verify',
    example: '123456',
  })
  @IsString()
  code!: string;

  @ApiProperty({
    description: 'The user ID associated with the OTP',
    example: '1',
  })
  @IsString()
  userId!: number;
}