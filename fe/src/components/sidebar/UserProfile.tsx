import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface UserProfileProps {
  username: string;
  isConnected: boolean;
  onUpdateUsername: (newName: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  username,
  isConnected,
  onUpdateUsername,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(username);

  const handleSave = () => {
    const clean = tempName.trim();
    if (clean && clean !== username) {
      onUpdateUsername(clean);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(username);
    setIsEditing(false);
  };

  return (
    <div className="p-3 border-b border-zinc-100">
      <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-2.5">
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              maxLength={20}
              className="flex-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleSave}
              title="Lưu tên"
              className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleCancel}
              title="Hủy"
              className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-200 text-zinc-600 hover:bg-zinc-300 transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-white">
                {username.substring(0, 2).toUpperCase()}
                <span
                  className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ring-2 ring-white ${
                    isConnected ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-800 truncate max-w-[130px]">
                  {username}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {isConnected ? 'Đang kết nối' : 'Mất kết nối'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setTempName(username);
                setIsEditing(true);
              }}
              title="Đổi tên của bạn"
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 transition"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
