// utils/repository.maps.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Market } from 'src/markets/entities/market.entity';
import { Region } from 'src/regions/entities/region.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

// Import other entities

@Injectable()
export class EntityRepositoryMap {
  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,

    @InjectRepository(Market)
    public readonly marketRepository: Repository<Market>,

    @InjectRepository(Region)
    public readonly regionRepository: Repository<Region>,
    // Add other repositories
  ) {}

  getRepository(entityType: string): Repository<any> | null {
    const map: Record<string, Repository<any>> = {
      users: this.userRepository,
      markets: this.marketRepository,
      regions: this.regionRepository,
      // Add other mappings
    };
    return map[entityType.toLowerCase()] || null;
  }
}
