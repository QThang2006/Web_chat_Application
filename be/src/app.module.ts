import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ChatModule } from './chat/chat.module';
import { User } from './entities/user.entity';
import { Room } from './entities/room.entity';
import { RoomMember } from './entities/room-member.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'chatuser',
      password: process.env.DB_PASSWORD || 'ChatUser@123',
      database: process.env.DB_NAME || 'webchat_db',
      entities: [User, Room, RoomMember, Message],
      synchronize: true, // Tự động tạo bảng trong MySQL khi khởi động
      charset: 'utf8mb4_unicode_ci',
      retryAttempts: 2,
      retryDelay: 1000,
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
