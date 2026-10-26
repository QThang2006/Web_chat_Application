import React from 'react';
import { X } from 'lucide-react';
import { RoomInfo } from '../../types/chat.types';
import { UserProfile } from './UserProfile';
import { RoomList } from './RoomList';
import { OnlineUsers } from './OnlineUsers';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  isConnected: boolean;
  onUpdateUsername: (newName: string) => void;
  rooms: RoomInfo[];
  currentRoom: string;
  onSelectRoom: (roomId: string) => void;
  onlineUsers: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  username,
  isConnected,
  onUpdateUsername,
  rooms,
  currentRoom,
  onSelectRoom,
  onlineUsers,
}) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-zinc-200/80 bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-100 px-4">
        <h1 className="text-sm font-semibold tracking-tight text-zinc-900">
          WebChat
        </h1>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* User Profile & Rename */}
      <UserProfile
        username={username}
        isConnected={isConnected}
        onUpdateUsername={onUpdateUsername}
      />

      {/* Room Navigation */}
      <RoomList
        rooms={rooms}
        currentRoom={currentRoom}
        onSelectRoom={onSelectRoom}
      />

      {/* Online Users List */}
      <OnlineUsers users={onlineUsers} currentUsername={username} />
    </aside>
  );
};
