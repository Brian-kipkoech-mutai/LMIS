import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userRepo.findOne({ where: { username } });
      if (!user) {
        throw new NotFoundException(`User with username ${username} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findById(user_id: number): Promise<User | null> {
    try {
      const user = await this.userRepo.findOne({ where: { user_id } });

      if (!user) {
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    //fast   hash the  password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepo.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });
    try {
      const saved = await this.userRepo.save(user);
      const { password, ...userWithoutPassword } = saved;
      return userWithoutPassword;
    } catch (err) {
      if ((err as any).code === '23505') {
        throw new ConflictException('Email or username already exists');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
