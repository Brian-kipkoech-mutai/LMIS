// src/market/market.entity.ts
import { Region } from 'src/regions/entities/region.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { MarketType } from '../enums/market.type.enums';

@Entity()
export class Market {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Auto-generated ID' })
  id!: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'Mogadishu', description: 'Market name' })
  name!: string;

  @CreateDateColumn()
  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Update timestamp',
  })
  updatedAt!: Date;

  @ManyToOne(() => Region, (region) => region.markets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'regionId' })
  region!: Region;

  @Column()
  regionId!: number;

  @ManyToOne(() => User, (user) => user.markets, {
    nullable: true,
    eager: true, //  automatically fetch the user when querying market
  })
  data_collector!: User;

  @Column({ nullable: true, type: 'enum', enum: MarketType })
  @ApiProperty({
    example: 'import',
    description: 'Type of market (import, export)',
    required: true,
  })
  marketType?: MarketType;
}
