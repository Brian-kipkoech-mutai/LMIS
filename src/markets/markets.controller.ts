import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MarketService } from './markets.service';
import { CreateMarketDto, UpdateMarketDto } from './dtos/market.dto';
import { Market } from './entities/market.entity';
import { Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';

@ApiTags('Markets')
@ApiBearerAuth()
@Controller('markets')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Use JWT authentication guard and custom roles guard
@Roles('admin')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new market' })
  @ApiResponse({ status: 201, description: 'Market created', type: Market })
  @ApiResponse({ status: 404, description: 'Region not found' })
  create(@Body() createMarketDto: CreateMarketDto) {
    return this.marketService.create(createMarketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all markets' })
  @ApiResponse({ status: 200, description: 'List of markets', type: [Market] })
  findAll() {
    return this.marketService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a market' })
  @ApiResponse({
    status: 200,
    description: 'Market updated',
    type: Market,
  })
  update(@Param('id') id: number, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketService.update(id, updateMarketDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a market' })
  @ApiResponse({ status: 204, description: 'Market deleted' })
  remove(@Param('id') id: number) {
    return this.marketService.remove(id);
  }
}
