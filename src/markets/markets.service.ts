import { AssignMarketsToRegionDto } from './dtos/market.dto';
// src/market/market.service.ts
import {
  BadRequestException,
  forwardRef,
  Inject,
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
    @Inject(forwardRef(() => UsersService)) //delay  it
    private usersService: UsersService,
    private regionsService: RegionsService,
  ) {}

  async create(createMarketDto: CreateMarketDto): Promise<Market> {
    const region = await this.regionsService.findOne(createMarketDto.regionId);
    if (!region) {
      throw new NotFoundException('Region not found');
    }
    console.log('Region found:', region);
    const market = this.marketRepository.create({
      ...createMarketDto,
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

  //updateEntity
  async detachDataCollectorFromMarkets(marketIds: number[]): Promise<void> {
    if (!marketIds.length) return;

    await this.marketRepository
      .createQueryBuilder()
      .update()
      .set({ data_collector: null })
      .whereInIds(marketIds)
      .execute();
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
    //check if markets are already assigned to the user
    const existingMarkets = user.markets || [];
    const alreadyAssigned = existingMarkets.some(
      (market) => market.id === market.id,
    );
    if (alreadyAssigned) {
      throw new BadRequestException(
        'Markets are already assigned to this user',
      );
    }
    //check if all markets belongs to the same region as the user allowed region
    const userRegionId = user.region?.id;
    if (!userRegionId) {
      throw new BadRequestException('User does not have an assigned region');
    }

    const marketsRegionIds = markets.map((market) => market.regionId);
    const allMarketsInUserRegion = marketsRegionIds.every(
      (regionId) => regionId === userRegionId,
    );
    if (!allMarketsInUserRegion) {
      throw new BadRequestException(
        'All markets must belong to the same region as the user',
      );
    }

    // Assign user to each market
    for (const market of markets) {
      market.data_collector = user;
      await this.save(market);
    }

    return true;
  }

  //find market per  region
  async findByRegion(regionId: number): Promise<Market[]> {
    const region = await this.regionsService.findOne(regionId);
    if (!region) {
      throw new NotFoundException('Region not found');
    }
    return this.marketRepository.find({
      where: { regionId },
      relations: ['region'],
    });
  }

  //assign markest  to a region
  async assignMarketsToRegion(
    regionId: number,
    { marketIds }: AssignMarketsToRegionDto,
  ): Promise<boolean> {
    const region = await this.regionsService.findOne(regionId);
    if (!region) {
      throw new NotFoundException('Region not found');
    }

    const markets = await this.findByIds(marketIds);

    if (markets.length !== marketIds.length) {
      throw new BadRequestException('One or more markets not found');
    }

    // Ensure none of the markets are already assigned to a region
    const alreadyAssigned = markets.some((market) => market.regionId);
    if (alreadyAssigned) {
      throw new BadRequestException(
        'One or more markets are already assigned to another region',
      );
    }

    for (const market of markets) {
      market.region = region;
      market.regionId = region.id;
      await this.save(market);
    }

    return true;
  }
}
