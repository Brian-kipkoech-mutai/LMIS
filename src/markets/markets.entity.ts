import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Market {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  region!: string;

  @Column({ type: 'jsonb', nullable: true })
  location?: { lat: number; lng: number }; // For future maps
}
