import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { User } from '../entities/user.entity';
import { Room } from '../entities/room.entity';
import { RoomMember } from '../entities/room-member.entity';
import { Message } from '../entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Room, RoomMember, Message])],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
