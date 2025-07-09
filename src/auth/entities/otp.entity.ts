import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number; // this is a foreign key

  @Column()
  code!: string;

  @Column({ type: 'enum', enum: ['email', 'sms'], default: 'email' })
  type!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  expiresAt!: Date;

  @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })  
  user!: User;
}
