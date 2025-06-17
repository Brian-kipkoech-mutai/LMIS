import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Market } from './markets.entity'; // Adjust the import path as necessary

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(Market)
    private marketsRepo: Repository<Market>,
  ) {}

  async createMarket(name: string, region: string) {
    return this.marketsRepo.save({ name, region });
  }

  async findAll() {
    return this.marketsRepo.find();
  }
}