import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  async findById(user_id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { user_id } });
  }

  // Optional: create user method for seeding or registration
  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
}
