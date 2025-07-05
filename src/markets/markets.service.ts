// src/market/market.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMarketDto, UpdateMarketDto } from './dtos/market.dto';
import { RegionsService } from 'src/regions/regions.service';
import { Market } from './entities/market.entity';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Market)
    private marketRepository: Repository<Market>,
    private regionsService: RegionsService,
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
}
