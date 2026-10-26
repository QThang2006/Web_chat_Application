import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';
import { Room } from '../entities/room.entity';
import { RoomMember } from '../entities/room-member.entity';
import * as fs from 'fs';
import * as path from 'path';

export interface ChatMessageDto {
  id?: string;
  user: string;
  room: string;
  text: string;
  time: string;
  ipAddress?: string;
}

@Injectable()
export class ChatService implements OnModuleInit {
  private readonly logger = new Logger(ChatService.name);
  private readonly dataDir = path.join(process.cwd(), 'data');
  private readonly dataFile = path.join(this.dataDir, 'messages.json');

  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(RoomMember)
    private readonly memberRepo: Repository<RoomMember>,
  ) {}

  async onModuleInit(): Promise<void> {
    this.ensureDataFile();
    await this.resetAllUsersOffline();
    await this.seedDefaultRooms();
  }

  private ensureDataFile(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      if (!fs.existsSync(this.dataFile)) {
        fs.writeFileSync(this.dataFile, JSON.stringify([]), 'utf-8');
      }
    } catch (err: any) {
      this.logger.error('Lỗi khởi tạo file JSON backup:', err);
    }
  }

  // Đưa toàn bộ User về OFFLINE khi server khởi động lại
  private async resetAllUsersOffline(): Promise<void> {
    try {
      await this.userRepo.update({ status: 'ONLINE' }, { status: 'OFFLINE' });
      this.logger.log('[MySQL] Đã đồng bộ trạng thái User về OFFLINE khi khởi động');
    } catch (err: any) {
      this.logger.warn(`Chưa thể reset trạng thái User trong MySQL: ${err?.message || err}`);
    }
  }

  // Khởi tạo các phòng mặc định đồng bộ 100% với Frontend
  private async seedDefaultRooms(): Promise<void> {
    try {
      const defaultRooms = [
        { name: 'Chung', description: 'Kênh thảo luận tổng quát cho cả 4 thành viên' },
        { name: 'NestJS-Backend', description: 'Kiến trúc Module, Gateway & TypeORM MySQL' },
        { name: 'React-Frontend', description: 'Giao diện SPA, Tailwind CSS & Components' },
        { name: 'Linux-Admin', description: 'Cấu hình Nginx, Systemd, UFW & SSL' },
      ];

      for (const r of defaultRooms) {
        const existing = await this.roomRepo.findOne({ where: { name: r.name } });
        if (!existing) {
          await this.roomRepo.save(this.roomRepo.create(r));
          this.logger.log(`[MySQL] Đã tạo phòng mặc định: ${r.name}`);
        }
      }
    } catch (err: any) {
      this.logger.warn(`Chưa thể khởi tạo phòng trong MySQL: ${err?.message || err}`);
    }
  }

  // Cập nhật hoặc tạo mới thông tin User trong MySQL
  public async syncUserStatus(
    username: string,
    status: 'ONLINE' | 'OFFLINE',
    ipAddress?: string,
  ): Promise<User | null> {
    try {
      let user = await this.userRepo.findOne({ where: { username } });
      if (!user) {
        user = this.userRepo.create({
          username,
          fullName: username,
          status,
          lastIp: ipAddress,
          lastSeen: new Date(),
        });
      } else {
        user.status = status;
        if (ipAddress) user.lastIp = ipAddress;
        user.lastSeen = new Date();
      }
      return await this.userRepo.save(user);
    } catch (err: any) {
      this.logger.warn(`Lỗi cập nhật User trong MySQL: ${err?.message || err}`);
      return null;
    }
  }

  // Ghi nhận thành viên tham gia phòng vào bảng room_members (quan hệ n-n)
  public async joinRoomMember(username: string, roomName: string): Promise<void> {
    try {
      const user = await this.userRepo.findOne({ where: { username } });
      const room = await this.roomRepo.findOne({ where: { name: roomName } });

      if (user && room) {
        const existing = await this.memberRepo.findOne({
          where: { roomId: room.id, userId: user.id },
        });

        if (!existing) {
          await this.memberRepo.save(
            this.memberRepo.create({
              roomId: room.id,
              userId: user.id,
              role: 'MEMBER',
            }),
          );
          this.logger.log(`[MySQL] Đã ghi nhận [${username}] là thành viên phòng [${roomName}]`);
        }
      }
    } catch (err: any) {
      this.logger.warn(`Lỗi lưu room_members: ${err?.message || err}`);
    }
  }

  // Đọc danh sách tin nhắn từ MySQL (chỉ fallback file khi MySQL mất kết nối)
  public async getMessages(room?: string): Promise<ChatMessageDto[]> {
    try {
      const query = this.messageRepo.createQueryBuilder('m');
      if (room) {
        query.where('m.room = :room', { room });
      }
      const dbMsgs = await query.orderBy('m.createdAt', 'ASC').take(100).getMany();

      // Nếu MySQL truy vấn thành công, trả về mảng kết quả (kể cả rỗng)
      return dbMsgs.map((m) => ({
        id: m.id,
        user: m.user,
        room: m.room,
        text: m.text,
        time: new Date(m.createdAt).toLocaleTimeString('vi-VN'),
        ipAddress: m.ipAddress,
      }));
    } catch (err: any) {
      this.logger.warn(`MySQL chưa kết nối, chuyển sang đọc file JSON: ${err?.message || err}`);
    }

    // Chỉ đọc từ file backup JSON nếu khối try bên trên phát sinh ngoại lệ
    try {
      const data = fs.readFileSync(this.dataFile, 'utf-8');
      const jsonMsgs: ChatMessageDto[] = JSON.parse(data);
      return room ? jsonMsgs.filter((m) => m.room === room) : jsonMsgs;
    } catch (err: any) {
      return [];
    }
  }

  // Lưu tin nhắn vào MySQL và file sao lưu
  public async saveMessage(msg: ChatMessageDto): Promise<void> {
    try {
      const entity = this.messageRepo.create({
        user: msg.user,
        room: msg.room,
        text: msg.text,
        ipAddress: msg.ipAddress,
      });
      await this.messageRepo.save(entity);
      this.logger.log(`[MySQL] Đã lưu tin nhắn của [${msg.user}] tại phòng [${msg.room}]`);
    } catch (err: any) {
      this.logger.warn(`Không thể ghi vào MySQL: ${err?.message || err}`);
    }

    try {
      const data = fs.readFileSync(this.dataFile, 'utf-8');
      const messages: ChatMessageDto[] = JSON.parse(data);
      messages.push(msg);
      if (messages.length > 100) messages.shift();
      fs.writeFileSync(this.dataFile, JSON.stringify(messages, null, 2), 'utf-8');
    } catch (err: any) {
      this.logger.error('Lỗi khi ghi file backup messages.json:', err);
    }
  }
}
