import React from 'react';
import { Message } from '../../types/chat.types';
import { MessageBubble } from './MessageBubble';
import { MessageSquareDashed } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  currentUsername: string;
  roomName: string;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUsername,
  roomName,
  bottomRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-zinc-50/40">
      {/* Date Separator Pill */}
      <div className="flex items-center justify-center my-1">
        <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-zinc-400 shadow-2xs">
          Hôm nay
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-400">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-400 shadow-2xs">
            <MessageSquareDashed className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-xs font-semibold text-zinc-600">
            Chưa có tin nhắn trong #{roomName}
          </p>
          <p className="text-[11px] text-zinc-400 max-w-xs mt-0.5">
            Hãy gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện.
          </p>
        </div>
      ) : (
        messages.map((m, idx) => {
          if (m.user === 'System') {
            return (
              <div key={m.id || idx} className="flex justify-center my-1">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] italic text-zinc-500 border border-zinc-200/60">
                  {m.text} • {m.time}
                </span>
              </div>
            );
          }

          const isSelf = m.user === currentUsername;
          return (
            <MessageBubble key={m.id || idx} message={m} isSelf={isSelf} />
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
};
