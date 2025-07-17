import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({ description: 'Code representing the grade' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  code!: string;

  @ApiProperty({ description: 'Description of the grade', required: false })
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ description: 'ID of the species this grade belongs to' })
  @IsNotEmpty()
  @IsNumber()
  species_id!: number;
}
