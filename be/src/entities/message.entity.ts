import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
@Index('IDX_messages_room_created_at', ['room', 'createdAt'])
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
