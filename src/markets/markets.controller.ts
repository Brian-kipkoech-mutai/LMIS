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
  ApiAcceptedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { MarketService } from './markets.service';
import { AssignMarketsToRegionDto, CreateMarketDto, UpdateMarketDto } from './dtos/market.dto';
import { Market } from './entities/market.entity';
import { Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRoles } from 'src/users/enums/user.roles.enums';

@ApiTags('Markets')
@ApiBearerAuth()
@Controller('markets')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Use JWT authentication guard and custom roles guard
@Roles(UserRoles.ADMIN)
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

  @ApiOperation({ summary: 'Assign markets to a data_collector' })
  @ApiAcceptedResponse({ description: 'Markets assigned successfully' })
  @ApiResponse({ status: 200, description: 'Markets assigned successfully' })
  @ApiResponse({ status: 404, description: 'User or markets not found' })
  @ApiBody({ schema: { example: { marketIds: [1, 2, 3] } } })
  @Patch(':user_id/assign-markets')
  assignMarketsToDataCollector(
    @Param('user_id') user_id: number,
    @Body('marketIds') marketIds: number[],
  ) {
    return this.marketService.assignMarkets(user_id, marketIds);
  }
  //   get markets per  regions
  @Get('region/:region_id')
  @ApiOperation({ summary: 'Get markets by region' })
  @ApiResponse({
    status: 200,
    description: 'List of markets in the region',
    type: [Market],
  })
  @ApiResponse({ status: 404, description: 'Region not found' })
  findMarketsByRegion(@Param('region_id') region_id: number) {
    return this.marketService.findByRegion(region_id);
  }

  //assign markets to regions
  @Patch(':region_id/assign-markets-to-region')
  @ApiOperation({ summary: 'Assign markets to a region' })
  @ApiAcceptedResponse({
    description: 'Markets assigned to region successfully',
  })
  @ApiResponse({
    status: 200,
    description: 'Markets assigned to region successfully',
  })
  @ApiResponse({ status: 404, description: 'Region or markets not found' })
  @ApiBody({ schema: { example: { marketIds: [1, 2, 3] } } })
  assignMarketsToRegion(
    @Param('region_id') region_id: number,
    @Body('marketIds') marketIds: AssignMarketsToRegionDto,
  ) {
    return this.marketService.assignMarketsToRegion(region_id, marketIds);
  }
}
