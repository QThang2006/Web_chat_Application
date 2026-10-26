import React, { useState } from 'react';
import { Hash, Search } from 'lucide-react';
import { RoomInfo } from '../../types/chat.types';

interface RoomListProps {
  rooms: RoomInfo[];
  currentRoom: string;
  onSelectRoom: (roomId: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  currentRoom,
  onSelectRoom,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = rooms.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2">
      {/* Search Input */}
      <div className="relative mb-3 flex items-center">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-400" />
        <input
          type="text"
          placeholder="Tìm kiếm kênh..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50/80 py-1.5 pl-8 pr-3 text-xs text-zinc-800 placeholder-zinc-400 outline-none transition focus:border-zinc-300 focus:bg-white focus:ring-1 focus:ring-zinc-200"
        />
      </div>

      <div className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
        Kênh Thảo Luận
      </div>

      <div className="space-y-1">
        {filtered.map((r) => {
          const isActive = currentRoom === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onSelectRoom(r.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition ${
                isActive
                  ? 'bg-zinc-100 text-zinc-900 font-semibold border-l-2 border-blue-600 shadow-2xs'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                  isActive ? 'bg-white text-blue-600 shadow-2xs' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                <Hash className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs truncate font-medium">{r.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
