import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from './entities/species.entity';
import { Grade } from './entities/grade.entity';
import { CreateSpeciesDto } from './dtos/create-species.dto';
import { UpdateSpeciesDto } from './dtos/update-species.dto';
import { CreateGradeDto } from './dtos/create-grade.dto';
import { UpdateGradeDto } from './dtos/update-grade.dto';
import { LIVESTOCK_TYPE_ERRORS } from './constants/livestock-type.constants';

@Injectable()
export class LivestockTypesService {
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {}

  // Species CRUD operations
  async createSpecies(createSpeciesDto: CreateSpeciesDto): Promise<Species> {
    const existingSpecies = await this.speciesRepository.findOne({
      where: { name: createSpeciesDto.name },
    });

    if (existingSpecies) {
      throw new ConflictException(LIVESTOCK_TYPE_ERRORS.SPECIES_EXISTS);
    }

    const species = this.speciesRepository.create(createSpeciesDto);
    return this.speciesRepository.save(species);
  }

  async findAllSpecies(): Promise<Species[]> {
    return this.speciesRepository.find();
  }

  async findOneSpecies(speciesId: number): Promise<Species> {
    const species = await this.speciesRepository.findOne({
      where: { id: speciesId },
      relations: ['grades'],
    });

    if (!species) {
      throw new NotFoundException(LIVESTOCK_TYPE_ERRORS.SPECIES_NOT_FOUND);
    }

    return species;
  }

  async updateSpecies(
    speciesId: number,
    updateSpeciesDto: UpdateSpeciesDto,
  ): Promise<Species> {
    const species = await this.findOneSpecies(speciesId);

    if (updateSpeciesDto.name && updateSpeciesDto.name !== species.name) {
      const existingSpecies = await this.speciesRepository.findOne({
        where: { name: updateSpeciesDto.name },
      });

      if (existingSpecies) {
        throw new ConflictException(LIVESTOCK_TYPE_ERRORS.SPECIES_EXISTS);
      }
    }

    Object.assign(species, updateSpeciesDto);
    return this.speciesRepository.save(species);
  }

  async removeSpecies(speciesId: number): Promise<void> {
    const species = await this.findOneSpecies(speciesId);
    await this.speciesRepository.remove(species);
  }

  // Grade CRUD operations
  async createGrade(createGradeDto: CreateGradeDto): Promise<Grade> {
    const species = await this.speciesRepository.findOne({
      where: { id: createGradeDto.species_id },
    });

    if (!species) {
      throw new NotFoundException(LIVESTOCK_TYPE_ERRORS.INVALID_SPECIES);
    }

    const existingGrade = await this.gradeRepository.findOne({
      where: {
        code: createGradeDto.code,
        species: { id: createGradeDto.species_id },
      },
    });

    if (existingGrade) {
      throw new ConflictException(LIVESTOCK_TYPE_ERRORS.GRADE_EXISTS);
    }

    const grade = this.gradeRepository.create({
      ...createGradeDto,
      species,
    });

    return this.gradeRepository.save(grade);
  }

  async findAllGrades(): Promise<Grade[]> {
    return this.gradeRepository.find({ relations: ['species'] });
  }

  async findGradesBySpecies(speciesId: number): Promise<Grade[]> {
    const species = await this.speciesRepository.findOne({
      where: { id: speciesId },
    });

    if (!species) {
      throw new NotFoundException(LIVESTOCK_TYPE_ERRORS.INVALID_SPECIES);
    }

    return this.gradeRepository.find({
      where: { species: { id: speciesId } },
      relations: ['species'],
    });
  }

  async findOneGrade(gradeId: number): Promise<Grade> {
    const grade = await this.gradeRepository.findOne({
      where: { id: gradeId },
      relations: ['species'],
    });

    if (!grade) {
      throw new NotFoundException(LIVESTOCK_TYPE_ERRORS.GRADE_NOT_FOUND);
    }

    return grade;
  }

  async updateGrade(
    gradeId: number,
    updateGradeDto: UpdateGradeDto,
  ): Promise<Grade> {
    const grade = await this.findOneGrade(gradeId);

    if (updateGradeDto.species_id !== grade.species.id) {
      const species = await this.speciesRepository.findOne({
        where: { id: updateGradeDto.species_id },
      });

      if (!species) {
        throw new NotFoundException(LIVESTOCK_TYPE_ERRORS.INVALID_SPECIES);
      }

      grade.species = species;
    }

    if (updateGradeDto.code && updateGradeDto.code !== grade.code) {
      const existingGrade = await this.gradeRepository.findOne({
        where: {
          code: updateGradeDto.code,
          species: { id: updateGradeDto.species_id },
        },
      });

      if (existingGrade) {
        throw new ConflictException(LIVESTOCK_TYPE_ERRORS.GRADE_EXISTS);
      }
    }

    Object.assign(grade, updateGradeDto);
    return this.gradeRepository.save(grade);
  }

  async removeGrade(gradeId: number): Promise<void> {
    const grade = await this.findOneGrade(gradeId);
    await this.gradeRepository.remove(grade);
  }
}
