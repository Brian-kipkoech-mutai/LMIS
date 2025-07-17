import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSpeciesDto {
  @ApiProperty({ description: 'Name of the species (e.g., Cattle, Goats)' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;
}
