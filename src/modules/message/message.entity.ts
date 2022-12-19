import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Dialog from '../dialog/dialog.entity';

@Entity()
export default class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false })
  userId: string;

  @ManyToOne(() => Dialog)
  dialog: Dialog;

  @Column({ unique: false })
  dialogId: string;

  @Column({ default: false })
  isChanged: boolean;

  @Column('text', { nullable: true })
  text: string;

  @Column({ nullable: true, default: '' })
  file: string;

  @Column({ nullable: true, array: true })
  images: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
