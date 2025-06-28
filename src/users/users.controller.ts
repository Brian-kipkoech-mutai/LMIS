import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { Audit } from 'src/audit/decorators/audit.decorator';
@ApiTags('users') // Swagger tag for users endpoints
@ApiBearerAuth() // Use Bearer token authentication
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Use JWT authentication guard and custom roles guard
@Roles('admin') // Only allow access to admin
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get specific user
  @ApiOperation({ summary: 'Get specific user' })
  @ApiAcceptedResponse({ description: 'Returns specific user details' })
  @ApiParam({ name: 'username', required: true, description: 'Username' })
  @ApiOperation({ summary: 'Update user info (partial)' })
  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  // create a new user
  @ApiOperation({ summary: 'Create a new user' })
  @ApiAcceptedResponse({ description: 'User created successfully' })
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //update user by id
  @ApiOperation({ summary: 'Update user' })
  @ApiAcceptedResponse({ description: 'User updated successfully' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @Patch(':id')
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Get all users
  @ApiOperation({ summary: 'Get all users' })
  @ApiAcceptedResponse({ description: 'Returns all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 404, description: 'No users found' })
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  //soft delete user by id
  @ApiOperation({ summary: 'Soft delete user by ID' })
  @ApiAcceptedResponse({ description: 'User soft deleted successfully' })
  @ApiResponse({ status: 200, description: 'User soft deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete('soft-delete/:id')
  async softDeleteUser(@Param('id') id: number) {
    return this.usersService.softDelete(id);
  }
}
