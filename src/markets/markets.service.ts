// src/market/market.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateMarketDto, UpdateMarketDto } from './dtos/market.dto';
import { RegionsService } from 'src/regions/regions.service';
import { Market } from './entities/market.entity';
import { UserRoles } from 'src/users/enums/user.roles.enums';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    private regionsService: RegionsService,
    private usersService: UsersService,
  ) {}

  async create(createMarketDto: CreateMarketDto): Promise<Market> {
    const region = await this.regionsService.findOne(createMarketDto.regionId);
    if (!region) {
      throw new NotFoundException('Region not found');
    }
    console.log('Region found:', region);
    const market = this.marketRepository.create({
      name: createMarketDto.name,
      regionId: region.id, // Associate the region with the market
    });

    return this.marketRepository.save(market);
  }

  async findAll(): Promise<Market[]> {
    return this.marketRepository.find({ relations: ['region'] });
  }

  async update(id: number, updateMarketDto: UpdateMarketDto): Promise<Market> {
    const market = await this.marketRepository.findOne({
      where: { id },
      relations: ['region'],
    });
    if (!market) {
      throw new NotFoundException('Market not found');
    }

    if (updateMarketDto.name) {
      market.name = updateMarketDto.name;
    }
    if (updateMarketDto.marketType) {
      market.marketType = updateMarketDto.marketType;
    }

    if (updateMarketDto.regionId) {
      const region = await this.regionsService.findOne(
        updateMarketDto.regionId,
      );
      if (!region) {
        throw new NotFoundException('Region not found');
      }
      market.region = region;
    }

    return this.marketRepository.save(market);
  }

  async remove(id: number): Promise<void> {
    const market = await this.marketRepository.findOne({ where: { id } });
    if (!market) {
      throw new NotFoundException('Market not found');
    }
    await this.marketRepository.remove(market);
  }

  //find  markets by ids
  findByIds(ids: number[]): Promise<Market[]> {
    return this.marketRepository.findBy({ id: In(ids) });
  }

  //save the market
  save(market: Market): Promise<Market> {
    return this.marketRepository.save(market);
  }

  //asing markest
  async assignMarkets(id: number, marketsIds: number[]): Promise<boolean> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.role !== UserRoles.DATA_COLLECTOR) {
      throw new BadRequestException(
        'Only FIELD_AGENT users can be assigned markets',
      );
    }
    const markets = await this.findByIds(marketsIds);

    // Validate all markets exist
    if (markets.length !== marketsIds.length) {
      throw new BadRequestException('One or more markets not found');
    }

    // Assign user to each market
    for (const market of markets) {
      market.data_collector = user;
      await this.save(market);
    }

    return true;
  }
}
