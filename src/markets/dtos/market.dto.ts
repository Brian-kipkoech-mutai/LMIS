// src/market/dto/create-market.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { MarketType } from '../enums/market.type.enums';

export class CreateMarketDto {
  @ApiProperty({ example: 'Mogadishu', required: true })
  name!: string;

  @ApiProperty({ example: 1, description: 'Region ID', required: true })
  regionId!: number;
  @ApiProperty({
    example: 'import',
    description: 'Type of market (import, export)',
    required: true,
    enum: MarketType,
    enumName: 'MarketType',
  })
  marketType?: MarketType;
}
export class UpdateMarketDto {
  @ApiProperty({ example: 'Mogadishu', required: true })
  name?: string;

  @ApiProperty({ example: 1, description: 'Region ID', required: true })
  regionId?: number;

  @ApiProperty({
    example: 'import',
    description: 'Type of market (import, export)',
    required: false,
    enum: MarketType,
    enumName: 'MarketType',
  })
  marketType?: MarketType;
}
