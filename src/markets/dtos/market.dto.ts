// src/market/dto/create-market.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarketDto {
  @ApiProperty({ example: 'Mogadishu', required: true })
  name!: string;

  @ApiProperty({ example: 1, description: 'Region ID', required: true })
  regionId!: number;
}
export class UpdateMarketDto {
  @ApiProperty({ example: 'Mogadishu', required: true })
  name?: string;

  @ApiProperty({ example: 1, description: 'Region ID', required: true })
  regionId?: number;
}
