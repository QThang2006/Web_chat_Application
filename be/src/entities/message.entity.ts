import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  user: string;

  @Column({ length: 100, default: 'Chung' })
  room: string;

  @Column('text')
  text: string;

  @Column({ length: 50, nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}
