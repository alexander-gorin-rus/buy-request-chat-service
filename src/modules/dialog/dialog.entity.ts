import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Dialog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { array: true })
  userIds: string[];

  @Column('varchar', { unique: true })
  dealId: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
