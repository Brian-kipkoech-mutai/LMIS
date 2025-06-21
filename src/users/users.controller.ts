import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
