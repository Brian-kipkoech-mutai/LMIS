import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class UpdateGradeDto {
  @ApiProperty({ description: 'Updated code for the grade' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  code!: string;

  @ApiProperty({
    description: 'Updated description of the grade',
    required: false,
  })
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ description: 'Updated species ID for the grade' })
  @IsNotEmpty()
  @IsNumber()
  species_id!: number;
}
