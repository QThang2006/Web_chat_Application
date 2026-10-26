import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('room_members')
export class RoomMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @Column()
  userId: string;

  @Column({ length: 20, default: 'MEMBER' })
  role: string; // OWNER, ADMIN, MEMBER

  @CreateDateColumn()
  joinedAt: Date;
}
