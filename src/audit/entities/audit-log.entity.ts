import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  action!: string;

  @Column()
  entityType!: string;

  @Column({ nullable: true })
  entityId?: string;

  @Column({ type: 'jsonb' })
  actor!: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  oldValues?: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  newValues?: Record<string, any> | null;

  @Column()
  ipAddress!: string;

  @Column()
  userAgent!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @Column({ default: true })
  success!: boolean;

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
