// src/region/region.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Region } from './entities/region.entity';
import { RegionsService } from './regions.service';
import { CreateRegionDto, UpdateRegionDto } from './dtos/region.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRoles } from 'src/users/enums/user.roles.enums';

@ApiTags('Regions')
@ApiBearerAuth()
@Controller('regions')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Use JWT authentication guard and custom roles guard
@Roles(UserRoles.ADMIN)
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new region' })
  @ApiResponse({ status: 201, description: 'Region created', type: Region })
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionsService.create(createRegionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all regions' })
  @ApiResponse({ status: 200, description: 'List of regions', type: [Region] })
  findAll() {
    return this.regionsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'Region ID' })
  @ApiOperation({ summary: 'Get region by ID' })
  @ApiResponse({ status: 200, description: 'Region found', type: Region })
  @ApiResponse({ status: 404, description: 'Region not found' })
  findOne(@Param('id') id: string) {
    return this.regionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'Region ID' })
  @ApiOperation({ summary: 'Update a region' })
  @ApiResponse({ status: 200, description: 'Region updated', type: Region })
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionsService.update(+id, updateRegionDto);
  }

  @ApiOperation({ summary: 'Delete a region' })
  @ApiResponse({ status: 204, description: 'Region deleted' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionsService.remove(+id);
  }
}
