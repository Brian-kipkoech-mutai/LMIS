import { Grade } from './grade.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('livestock_species')
export class Species {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'The unique identifier of the species' })
    id!: number;

    @Column({ unique: true })
    @ApiProperty({ description: 'The name of the species (e.g., Cattle, Goats)' })
    name!: string;

    @OneToMany(() => Grade, (grade) => grade.species)
    grades!: Grade[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
