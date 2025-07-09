// update user dto
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class UpdateUserDto {
  @ApiProperty({ required: false })
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @MinLength(4)
  password?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumber?: string;



}
