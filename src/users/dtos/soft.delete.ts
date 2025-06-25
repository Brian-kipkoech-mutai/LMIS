// soft delete  dto
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SoftDeleteDto {
  @ApiProperty()
  @IsNumber()
  user_id!: number;
}
