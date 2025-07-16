// src/region/region.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { CreateRegionDto, UpdateRegionDto } from './dtos/region.dto';
@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    const region = this.regionRepository.create(createRegionDto);
    return this.regionRepository.save(region);
  }

  async findAll(): Promise<Region[]> {
    return this.regionRepository.find({ relations:['markets']});
  }

  async findOne(id: number): Promise<Region | null> {
    return this.regionRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateRegionDto: UpdateRegionDto,
  ): Promise<Region | null> {
    await this.regionRepository.update(id, updateRegionDto);
    return this.regionRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    const region = await this.regionRepository.findOneBy({ id });
    if (!region) {
      throw new Error('Region not found');
    }
    await this.regionRepository.remove(region);
  }
}
