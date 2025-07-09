//create  user dto
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '../enums/user.roles.enums';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    enum: UserRoles,
    enumName: 'UserRoles',
    description: 'Role of the user',
    required: true,
    example: UserRoles.DATA_ANALYST, // Example value for Swagger documentation
  })
  @IsString()
  @IsNotEmpty()
  role!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber!: string;
}
