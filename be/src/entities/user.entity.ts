import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomMember } from './room-member.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 100, nullable: true })
  fullName: string;

  @Column({ length: 255, nullable: true })
  passwordHash: string;

  @Column({ length: 20, default: 'OFFLINE' })
  status: string; // ONLINE, OFFLINE, AWAY

  @Column({ length: 50, nullable: true })
  lastIp: string;

  @Column({ type: 'datetime', nullable: true })
  lastSeen: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => RoomMember, (member) => member.user)
  roomMemberships: RoomMember[];
}
