import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateSpeciesDto {
  @ApiProperty({ description: 'Updated name of the species' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;
}
