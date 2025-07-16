// src/market/dto/create-market.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { MarketType } from '../enums/market.type.enums';
import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class CreateMarketDto {
  @ApiProperty({ example: 'Mogadishu', required: true })
  name!: string;

  @ApiProperty({ example: 1, description: 'Region ID', required: true })
  regionId!: number;
  @ApiProperty({
    example: 'import',
    description: 'Type of market (local, export)',
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
    description: 'Type of market (local, export)',
    required: true,
    enum: MarketType,
    enumName: 'MarketType',
  })
  marketType?: MarketType;
}

// asign markest to regions dto
export class AssignMarketsToRegionDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of Market IDs',
    required: true,
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  marketIds!: number[];
}
