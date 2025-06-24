import { Controller, Get, Param, Post, UseGuards, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dtos/createUser.dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users') // Swagger tag for users endpoints
@ApiBearerAuth() // Use Bearer token authentication
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Use JWT authentication guard and custom roles guard
@Roles('admin') // Only allow access to admin
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get specific user' })
  @ApiAcceptedResponse({ description: 'Returns specific user details' })
  @ApiParam({ name: 'username', required: true, description: 'Username' })
  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiAcceptedResponse({ description: 'User created successfully' })
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
