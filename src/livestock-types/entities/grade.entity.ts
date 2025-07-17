import { Species } from './species.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('livestock_grade')
export class Grade {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the grade' })
  id!: number;

  @Column()
  @ApiProperty({ description: 'The code representing the grade' })
  code!: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Description of the grade', required: false })
  description?: string;

  @ManyToOne(() => Species, (species) => species.grades, { nullable: false })
  species!: Species;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
