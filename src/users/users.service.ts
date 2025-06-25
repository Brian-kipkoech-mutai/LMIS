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
import { UpdateUserDto } from './dtos/updateUser.dto';
import { hashPassword } from 'src/utils/hash.passoword';
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
    const hashedPassword = await hashPassword(createUserDto.password);
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

  async update(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.findById(user_id);
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // Update user properties
    Object.assign(user, updateUserDto);

    // If password is updated, hash it
    if (updateUserDto.password) {
      user.password = await hashPassword(updateUserDto.password);
    }
    // Save the updated user
    try {
      const saved = await this.userRepo.save(user);
      const { password, ...userWithoutPassword } = saved;
      return userWithoutPassword;
    } catch (err) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  //get all users

  async findAll(): Promise<Omit<User, 'password'>[]> {
    try {
      const users = await this.userRepo.find({ where: { isDeleted: false } });
      return users.map(
        ({ password, ...userWithoutPassword }) => userWithoutPassword,
      );
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  // soft delete user by id

  async softDelete(user_id: number): Promise<void> {
    const user = await this.findById(user_id);
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // Set isDeleted to true instead of removing the user
    user.isDeleted = true;

    try {
      await this.userRepo.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
