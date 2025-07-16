import { IsOptional, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class MarketUpdateDto {
  @ApiPropertyOptional({
    description: 'IDs of markets to assign to the user',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  add?: number[];

  @ApiPropertyOptional({
    description: 'IDs of markets to remove from the user',
    example: [4, 5],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  remove?: number[];
}

export class UpdateUserRegionAndMarketsDto {
  @ApiPropertyOptional({
    description: 'ID of the new region to assign to the user',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  regionId?: number;

  @ApiPropertyOptional({
    description: 'Market assignments to update for the user',
    type: MarketUpdateDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MarketUpdateDto)
  markets?: MarketUpdateDto;
}
