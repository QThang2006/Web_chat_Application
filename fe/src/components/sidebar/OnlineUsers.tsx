import React from 'react';
import { Users } from 'lucide-react';

interface OnlineUsersProps {
  users: string[];
  currentUsername: string;
}

export const OnlineUsers: React.FC<OnlineUsersProps> = ({
  users,
  currentUsername,
}) => {
  return (
    <div className="border-t border-zinc-100 p-3 max-h-40 overflow-y-auto">
      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Users className="h-3 w-3" /> Trực Tuyến
        </span>
        <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-600">
          {users.length}
        </span>
      </div>

      <div className="space-y-1">
        {users.map((u, idx) => {
          const isSelf = u === currentUsername;
          return (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-zinc-600"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">
                {u} {isSelf && <span className="text-[10px] text-zinc-400">(Bạn)</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
