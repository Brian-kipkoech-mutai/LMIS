import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lmis_user')
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string;
}
