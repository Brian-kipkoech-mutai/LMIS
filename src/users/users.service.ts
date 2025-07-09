import { MarketService } from './../markets/markets.service';
import {
  BadRequestException,
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
import { UserRoles } from './enums/user.roles.enums';
import { Market } from 'src/markets/entities/market.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly marketService: MarketService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    //fast   hash the  password
    const hashedPassword = await hashPassword(createUserDto.password);
    const user = this.userRepo.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      role: UserRoles[createUserDto.role],
      phoneNumber: createUserDto.phoneNumber,
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
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
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
      if (updateUserDto.password) {
        await this.updateLastPasswordChange(id);
      }

      const { password, ...userWithoutPassword } = saved;
      return userWithoutPassword;
    } catch (err) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  //get all users

  async findAll(): Promise<Omit<User, 'password'>[]> {
    try {
      const users = await this.userRepo.find();
      return users.map(
        ({ password, ...userWithoutPassword }) => userWithoutPassword,
      );
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  // soft delete user by id

  async softDelete(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepo.softDelete(id);
  }

  //update last  login it will be used in the    auth   ,module

  async updateLastLogin(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.lastLogin = new Date();
    await this.userRepo.save(user);
  }

  async updateLastPasswordChange(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.lastPasswordChange = new Date();
    await this.userRepo.save(user);
  }

  //find by role
  async findByRole(role: UserRoles): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepo.find({ where: { role } });
    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  //assign markets to use

  async assignMarkets(id: number, marketsIds: number[]): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.role == UserRoles.DATA_COLLECTOR) {
      throw new BadRequestException(
        'Only FIELD_AGENT users can be assigned markets',
      );
    }
    const markets = await this.marketService.findByIds(marketsIds);

    // Validate all markets exist
    if (markets.length !== marketsIds.length) {
      throw new BadRequestException('One or more markets not found');
    }

    // Assign user to each market
    for (const market of markets) {
      market.data_collector = user;
      await this.marketService.save(market);
    }

    return true;
  }
}
