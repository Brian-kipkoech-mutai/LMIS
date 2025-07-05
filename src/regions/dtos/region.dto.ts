import { ApiProperty } from '@nestjs/swagger';

export class CreateRegionDto {
  @ApiProperty({ example: 'Somalia', required: true })
  name!: string;
}
export class UpdateRegionDto {
  @ApiProperty({ example: 'Somalia', required: true })
  name!: string;
}
