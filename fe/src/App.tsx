import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, RoomInfo } from './types/chat.types';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatHeader } from './components/chat/ChatHeader';
import { MessageList } from './components/chat/MessageList';
import { ChatInput } from './components/chat/ChatInput';

const ROOMS_CONFIG: RoomInfo[] = [
  {
    id: 'Chung',
    name: 'Phòng Chung',
    desc: 'Kênh thảo luận tổng quát cho cả 4 thành viên',
  },
  {
    id: 'NestJS-Backend',
    name: 'NestJS Backend',
    desc: 'Kiến trúc Module, Gateway & TypeORM MySQL',
  },
  {
    id: 'React-Frontend',
    name: 'React Frontend',
    desc: 'Giao diện SPA, Tailwind CSS & Components',
  },
  {
    id: 'Linux-Admin',
    name: 'Quản trị Ubuntu',
    desc: 'Cấu hình Nginx, Systemd, UFW & SSL',
  },
];

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem('chat_user') || 'SinhVien_' + Math.floor(100 + Math.random() * 900);
  });
  const [currentRoom, setCurrentRoom] = useState<string>('Chung');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // FIX LỖI STALE CLOSURE BẰNG REF
  const currentRoomRef = useRef(currentRoom);
  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<any>(null);

  // Kết nối Socket.io qua Nginx Reverse Proxy
  useEffect(() => {
    const newSocket = io({
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join', { username, room: currentRoomRef.current });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Lắng nghe lịch sử tin nhắn ban đầu hoặc khi đổi phòng
    newSocket.on('init-history', (history: Message[]) => {
      if (Array.isArray(history)) {
        // Lọc đúng phòng hiện tại theo Ref
        const filtered = history.filter((m) => !m.room || m.room === currentRoomRef.current);
        setMessages(filtered);
      }
    });

    // Lắng nghe tin nhắn mới theo thời gian thực
    newSocket.on('chat-message', (msg: Message) => {
      if (!msg.room || msg.room === currentRoomRef.current) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Thông báo hệ thống
    newSocket.on('system-message', (data: { text: string; time: string }) => {
      setMessages((prev) => [
        ...prev,
        { user: 'System', text: data.text, time: data.time },
      ]);
    });

    // Cập nhật người online trong phòng
    newSocket.on('room-users', (data: { room: string; users: string[] }) => {
      if (data.room === currentRoomRef.current) {
        setOnlineUsers(data.users);
      }
    });

    // Người khác đang gõ phím
    newSocket.on('user-typing', (data: { user: string; isTyping: boolean }) => {
      if (data.isTyping) {
        setTypingUser(data.user);
      } else {
        setTypingUser(null);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Đổi phòng chat
  const handleSelectRoom = (roomId: string) => {
    if (roomId === currentRoom) return;

    setCurrentRoom(roomId);
    currentRoomRef.current = roomId;
    setMessages([]); // Dọn sạch khung tin nhắn phòng cũ
    setIsSidebarOpen(false);

    if (socket && isConnected) {
      socket.emit('join', { username, room: roomId });
    }
  };

  // Đổi tên người dùng (lưu vào localStorage & MySQL)
  const handleUpdateUsername = (newName: string) => {
    setUsername(newName);
    localStorage.setItem('chat_user', newName);

    if (socket && isConnected) {
      socket.emit('join', { username: newName, room: currentRoomRef.current });
    }
  };

  // Gửi tin nhắn mới
  const handleSendMessage = (text: string) => {
    if (!socket || !text.trim()) return;

    socket.emit('chat-message', {
      text,
      room: currentRoom,
    });
  };

  // Báo trạng thái gõ phím
  const handleTyping = (isTyping: boolean) => {
    if (!socket) return;
    socket.emit('typing', isTyping);

    if (isTyping) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        socket.emit('typing', false);
      }, 1500);
    }
  };

  // Tự cuộn xuống đáy khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const activeRoom = ROOMS_CONFIG.find((r) => r.id === currentRoom) || ROOMS_CONFIG[0];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 text-zinc-900 font-sans">
      {/* 1. Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        username={username}
        isConnected={isConnected}
        onUpdateUsername={handleUpdateUsername}
        rooms={ROOMS_CONFIG}
        currentRoom={currentRoom}
        onSelectRoom={handleSelectRoom}
        onlineUsers={onlineUsers}
      />

      {/* 2. Main Chat Area */}
      <main className="flex flex-1 flex-col overflow-hidden bg-zinc-50/50">
        {/* Chat Header */}
        <ChatHeader
          room={activeRoom}
          onlineCount={onlineUsers.length}
          typingUser={typingUser}
          isConnected={isConnected}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Message List */}
        <MessageList
          messages={messages}
          currentUsername={username}
          roomName={activeRoom.name}
          bottomRef={messagesEndRef}
        />

        {/* Chat Input */}
        <ChatInput
          roomName={activeRoom.name}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
        />
      </main>
    </div>
  );
}
