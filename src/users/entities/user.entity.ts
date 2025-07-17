import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Otp } from '../../auth/entities/otp.entity';
import { Market } from 'src/markets/entities/market.entity';
import { UserRoles } from '../enums/user.roles.enums';
import { Region } from 'src/regions/entities/region.entity';
@Entity('lmis_user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ enum: UserRoles, type: 'enum' })
  role!: UserRoles;

  @Column({ type: 'varchar', length: 12, unique: true, nullable: true })
  phoneNumber!: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => Region, { nullable: true })
  @JoinColumn({ name: 'regionId' })
  region?: Region;

  @Column({ nullable: true })
  regionId?: number;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastPasswordChange?: Date;

  @OneToMany(() => Otp, (otp) => otp.user, { cascade: true })
  otps?: Otp[];

  @OneToMany(() => Market, (market) => market.data_collector, {
    nullable: true,
  })
  markets!: Market[];
}
