import React from 'react';
import { Hash, Menu, Wifi, WifiOff } from 'lucide-react';
import { RoomInfo } from '../../types/chat.types';

interface ChatHeaderProps {
  room: RoomInfo;
  onlineCount: number;
  typingUser: string | null;
  isConnected: boolean;
  onOpenSidebar: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  room,
  onlineCount,
  typingUser,
  isConnected,
  onOpenSidebar,
}) => {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-blue-600">
          <Hash className="h-4 w-4" />
        </div>

        <div>
          <h2 className="text-xs font-bold text-zinc-900">{room.name}</h2>
          <p className="text-[10px] text-zinc-400">
            {typingUser ? (
              <span className="text-blue-600 font-medium animate-pulse">
                {typingUser} đang gõ...
              </span>
            ) : (
              <span>{onlineCount} thành viên trực tuyến</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium border ${
            isConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
              : 'bg-rose-50 text-rose-700 border-rose-200/60'
          }`}
        >
          {isConnected ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Trực tuyến</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-rose-500" />
              <span>Mất kết nối</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
