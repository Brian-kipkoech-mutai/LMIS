import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateSpeciesDto } from './dtos/create-species.dto';
import { UpdateSpeciesDto } from './dtos/update-species.dto';
import { CreateGradeDto } from './dtos/create-grade.dto';
import { UpdateGradeDto } from './dtos/update-grade.dto';
import { SpeciesResponseDto } from './dtos/livestock-type.response.dto';
import { GradeResponseDto } from './dtos/livestock-type.response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { LivestockTypesService } from './livestock-types.service';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRoles } from 'src/users/enums/user.roles.enums';
import { Audit } from 'src/audit/decorators/audit.decorator';
import { EntityType } from 'src/audit/constants/enums/entity-type.enum';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Livestock Types')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRoles.ADMIN)
@Controller('livestock-types')
export class LivestockTypesController {
  constructor(private readonly livestockTypesService: LivestockTypesService) {}

  // Species endpoints

  @Post('species')
  @Audit({
    entityType: EntityType.SPECIES,
  })
  @ApiOperation({ summary: 'Create a new livestock species' })
  @ApiResponse({
    status: 201,
    description: 'Species created',
    type: SpeciesResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Species with this name already exists',
  })
  async createSpecies(@Body() createSpeciesDto: CreateSpeciesDto) {
    return this.livestockTypesService.createSpecies(createSpeciesDto);
  }

  @Get('species')
  @ApiOperation({ summary: 'Get all livestock species' })
  @ApiResponse({
    status: 200,
    description: 'List of species',
    type: [SpeciesResponseDto],
  })
  async findAllSpecies() {
    return this.livestockTypesService.findAllSpecies();
  }

  @Get('species/:id')
  @ApiOperation({ summary: 'Get a specific livestock species by ID' })
  @ApiResponse({
    status: 200,
    description: 'Species details',
    type: SpeciesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Species not found' })
  async findOneSpecies(@Param('id') id: string) {
    return this.livestockTypesService.findOneSpecies(+id);
  }

  @Put('species/:id')
  @Audit({
    entityType: EntityType.SPECIES,
  })
  @ApiOperation({ summary: 'Update a livestock species' })
  @ApiResponse({
    status: 200,
    description: 'Species updated',
    type: SpeciesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Species not found' })
  @ApiResponse({
    status: 409,
    description: 'Species with this name already exists',
  })
  async updateSpecies(
    @Param('id') id: string,
    @Body() updateSpeciesDto: UpdateSpeciesDto,
  ) {
    return this.livestockTypesService.updateSpecies(+id, updateSpeciesDto);
  }

  @Delete('species/:id')
  @Audit({
    entityType: EntityType.SPECIES,
  })
  @ApiOperation({ summary: 'Delete a livestock species' })
  @ApiResponse({ status: 200, description: 'Species deleted' })
  @ApiResponse({ status: 404, description: 'Species not found' })
  async removeSpecies(@Param('id') id: string) {
    return this.livestockTypesService.removeSpecies(+id);
  }

  // Grade endpoints
  @Post('grades')
  @Audit({
    entityType: EntityType.GRADE,
  })
  @ApiOperation({ summary: 'Create a new livestock grade' })
  @ApiResponse({
    status: 201,
    description: 'Grade created',
    type: GradeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Species not found' })
  @ApiResponse({
    status: 409,
    description: 'Grade with this code already exists for this species',
  })
  async createGrade(@Body() createGradeDto: CreateGradeDto) {
    return this.livestockTypesService.createGrade(createGradeDto);
  }

  @Get('grades')
  @ApiOperation({ summary: 'Get all livestock grades' })
  @ApiResponse({
    status: 200,
    description: 'List of grades',
    type: [GradeResponseDto],
  })
  @ApiQuery({
    name: 'speciesId',
    required: false,
    description: 'Filter grades by species ID',
  })
  async findAllGrades(@Query('speciesId') speciesId?: string) {
    if (speciesId) {
      return this.livestockTypesService.findGradesBySpecies(+speciesId);
    }
    return this.livestockTypesService.findAllGrades();
  }

  @Get('grades/:id')
  @ApiOperation({ summary: 'Get a specific livestock grade by ID' })
  @ApiResponse({
    status: 200,
    description: 'Grade details',
    type: GradeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  async findOneGrade(@Param('id') id: string) {
    return this.livestockTypesService.findOneGrade(+id);
  }

  @Put('grades/:id')
  @Audit({
    entityType: EntityType.GRADE,
  })
  @ApiOperation({ summary: 'Update a livestock grade' })
  @ApiResponse({
    status: 200,
    description: 'Grade updated',
    type: GradeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Grade or species not found' })
  @ApiResponse({
    status: 409,
    description: 'Grade with this code already exists for this species',
  })
  async updateGrade(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
  ) {
    return this.livestockTypesService.updateGrade(+id, updateGradeDto);
  }

  @Delete('grades/:id')
  @Audit({
    entityType: EntityType.GRADE,
  })
  @ApiOperation({ summary: 'Delete a livestock grade' })
  @ApiResponse({ status: 200, description: 'Grade deleted' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  async removeGrade(@Param('id') id: string) {
    return this.livestockTypesService.removeGrade(+id);
  }
}
