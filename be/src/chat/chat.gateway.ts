import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService, ChatMessageDto } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private users = new Map<string, { username: string; room: string }>();

  constructor(private readonly chatService: ChatService) {}

  private getClientIp(client: Socket): string {
    const rawIp =
      (client.handshake.headers['x-forwarded-for'] as string) ||
      client.handshake.address ||
      '';
    const firstIp = rawIp.split(',')[0].trim();
    return firstIp.replace(/^::ffff:/, '') || '127.0.0.1';
  }

  async handleConnection(client: Socket) {
    const clientIp = this.getClientIp(client);
    this.logger.log(`[Linux Server Log] Client connected: ${client.id} (IP: ${clientIp})`);
    // Lịch sử tin nhắn sẽ được gửi theo từng phòng cụ thể khi client phát sự kiện 'join'
  }

  async handleDisconnect(client: Socket) {
    const user = this.users.get(client.id);
    if (user) {
      // Cập nhật trạng thái OFFLINE trong MySQL
      await this.chatService.syncUserStatus(user.username, 'OFFLINE');

      this.server.to(user.room).emit('system-message', {
        text: `${user.username} đã ngắt kết nối.`,
        time: new Date().toLocaleTimeString('vi-VN'),
      });
      this.users.delete(client.id);
      this.broadcastRoomUsers(user.room);
    }
    this.logger.log(`[Linux Server Log] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { username: string; room: string },
  ) {
    const clientIp = this.getClientIp(client);
    const cleanName = (payload.username || 'Khách').trim().substring(0, 20);
    const cleanRoom = (payload.room || 'Chung').trim();

    const oldUser = this.users.get(client.id);
    if (oldUser) {
      client.leave(oldUser.room);
      this.server.to(oldUser.room).emit('system-message', {
        text: `${oldUser.username} đã rời phòng.`,
        time: new Date().toLocaleTimeString('vi-VN'),
      });

      // Nếu người dùng đổi tên, đưa tên cũ về OFFLINE
      if (oldUser.username !== cleanName) {
        await this.chatService.syncUserStatus(oldUser.username, 'OFFLINE');
      }
    }

    client.join(cleanRoom);
    this.users.set(client.id, { username: cleanName, room: cleanRoom });

    // Đồng bộ trạng thái ONLINE và lưu thành viên vào bảng room_members
    await this.chatService.syncUserStatus(cleanName, 'ONLINE', clientIp);
    await this.chatService.joinRoomMember(cleanName, cleanRoom);

    this.server.to(cleanRoom).emit('system-message', {
      text: `${cleanName} đã vào phòng [${cleanRoom}].`,
      time: new Date().toLocaleTimeString('vi-VN'),
    });

    const roomHistory = await this.chatService.getMessages(cleanRoom);
    client.emit('init-history', roomHistory);

    // Cập nhật danh sách người dùng cho phòng mới
    this.broadcastRoomUsers(cleanRoom);

    // Cập nhật lại danh sách cho phòng cũ nếu vừa chuyển phòng
    if (oldUser && oldUser.room !== cleanRoom) {
      this.broadcastRoomUsers(oldUser.room);
    }
  }

  @SubscribeMessage('chat-message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { text: string },
  ) {
    const user = this.users.get(client.id);
    if (!user || !payload.text || !payload.text.trim()) return;

    const clientIp = this.getClientIp(client);

    const messageData: ChatMessageDto = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      user: user.username,
      room: user.room,
      text: payload.text.trim().substring(0, 500),
      time: new Date().toLocaleTimeString('vi-VN'),
      ipAddress: clientIp,
    };

    // Lưu vào MySQL database
    await this.chatService.saveMessage(messageData);

    this.server.to(user.room).emit('chat-message', messageData);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() isTyping: boolean,
  ) {
    const user = this.users.get(client.id);
    if (user) {
      client.to(user.room).emit('user-typing', {
        user: user.username,
        isTyping: !!isTyping,
      });
    }
  }

  private broadcastRoomUsers(room: string) {
    const roomUsers: string[] = [];
    for (const [_, u] of this.users.entries()) {
      if (u.room === room) roomUsers.push(u.username);
    }
    this.server.to(room).emit('room-users', {
      room,
      count: roomUsers.length,
      users: roomUsers,
    });
  }
}
