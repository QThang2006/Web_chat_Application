import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity('room_members')
@Unique('UQ_room_members_room_user', ['roomId', 'userId'])
@Index('IDX_room_members_room_id', ['roomId'])
@Index('IDX_room_members_user_id', ['userId'])
export class RoomMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  roomId: string;

  @ManyToOne(() => Room, (room) => room.members, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'roomId', referencedColumnName: 'id' })
  room: Room;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, (user) => user.roomMemberships, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column({ length: 20, default: 'MEMBER' })
  role: string; // OWNER, ADMIN, MEMBER

  @CreateDateColumn()
  joinedAt: Date;
}
