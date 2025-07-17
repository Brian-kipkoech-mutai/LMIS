import { Region } from './../regions/entities/region.entity';
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
import { UserRoles } from './enums/user.roles.enums';
import { RegionsService } from 'src/regions/regions.service';
import { MarketService } from 'src/markets/markets.service';
import { UpdateUserRegionAndMarketsDto } from './dtos/update-user-region-markets.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly regionService: RegionsService,
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
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['markets', 'region'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    if (
      createUserDto.role === UserRoles.DATA_COLLECTOR &&
      !!!createUserDto.regionId
    ) {
      throw new ConflictException(
        `Invalid data  for: ${createUserDto.role}. Data collectors must be assigned to a region.`,
      );
    }
    const regionEntity = createUserDto.regionId
      ? await this.regionService.findOne(createUserDto.regionId)
      : undefined;

    if (regionEntity === null || regionEntity === undefined) {
      throw new NotFoundException(
        `Region with ID ${createUserDto.regionId} not found`,
      );
    }
    //hash the password before saving
    const hashedPassword = await hashPassword(createUserDto.password);

    const user = this.userRepo.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      role: UserRoles[createUserDto.role.toLocaleUpperCase()],
      phoneNumber: createUserDto.phoneNumber,
      regionId: regionEntity.id,
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
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['region', 'markets'], // Load region and markets to handle logic
    });
    console.log('userObj', user);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    console.log(
      'region details',
      updateUserDto.regionId,
      updateUserDto.regionId !== user.region?.id,
    );
    // Handle region change
    if (updateUserDto.regionId && updateUserDto.regionId !== user.region?.id) {
      const newRegion = await this.regionService.findOne(
        updateUserDto.regionId,
      );
      if (!newRegion) {
        throw new NotFoundException(
          `Region with ID ${updateUserDto.regionId} not found`,
        );
      }

      // Detach all currently assigned markets
      if (user.markets) {
        console.log('markeres  to detach');
        const marketIdsToDetach = user.markets.map(({ id }) => id);
        console.log('markeres  to detach', marketIdsToDetach);

        await this.marketService.detachDataCollectorFromMarkets(
          marketIdsToDetach,
        );
      }
      user.region = newRegion;
      //prevent reataching markets  during saving
      user.markets = [];
    }

    // Update other fields
    Object.assign(user, updateUserDto);

    // Hash password if updated
    if (updateUserDto.password) {
      user.password = await hashPassword(updateUserDto.password);
    }

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

    //we need to check if user is  data collector first,  if so we need to detach the markets
    if (user.role === UserRoles.DATA_COLLECTOR && user.markets.length > 0) {
      const marketIds = user.markets.map((market) => market.id);
      await this.marketService.detachDataCollectorFromMarkets(marketIds);
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
    const users =
      role === UserRoles.DATA_COLLECTOR
        ? await this.userRepo.find({
            where: { role },
            relations: ['region', 'markets'],
          })
        : await this.userRepo.find({ where: { role } });

    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );
  }

  // update  regions and markets
  async updateRegionAndHandleMarkets(
    userId: number,
    payload: UpdateUserRegionAndMarketsDto,
  ): Promise<Omit<User, 'password'>> {
    //  Step 1: Reuse your existing update logic for region & password
    const updatedUser = await this.update(userId, {
      regionId: payload.regionId,
    });

    //  Step 2: Handle Market Removal
    if (
      updatedUser?.region?.id === payload.regionId &&
      payload.markets?.remove?.length
    ) {
      const marketsToRemove = await this.marketService.findByIds(
        payload.markets.remove,
      );

      for (const market of marketsToRemove) {
        if (market.data_collector?.id === userId) {
          market.data_collector = null;
          await this.marketService.save(market);
        }
      }
    }

    //  Step 3: Handle Market Assignment
    if (payload.markets?.add?.length) {
      await this.marketService.assignMarkets(userId, payload.markets.add);
    }

    //  Return updated user without password
    const finalUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['region', 'markets'],
    });

    if (!finalUser) {
      throw new NotFoundException('User update failed');
    }

    const { password, ...userWithoutPassword } = finalUser;
    return userWithoutPassword;
  }
}
