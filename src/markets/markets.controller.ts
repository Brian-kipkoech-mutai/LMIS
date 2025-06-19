import { Controller, Query } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { Post, Get } from '@nestjs/common';
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Post('/create')
  async createMarket(
    @Query('name') name: string,
    @Query('region') region: string,
  ) {
    console.log(`Creating market with name: ${name} and region: ${region}`);
    return this.marketsService.createMarket(name, region);
  }

  @Get()
  async findAll() {
    return this.marketsService.findAll();
  }
}
