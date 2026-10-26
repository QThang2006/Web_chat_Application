import React from 'react';
import { CheckCheck } from 'lucide-react';
import { Message } from '../../types/chat.types';

interface MessageBubbleProps {
  message: Message;
  isSelf: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isSelf,
}) => {
  return (
    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
      {/* Sender Meta */}
      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-zinc-400">
        <span className="font-semibold text-zinc-600">
          {isSelf ? 'Bạn' : message.user}
        </span>
        <span>•</span>
        <span>{message.time}</span>
        {message.ipAddress && (
          <span className="rounded border border-zinc-200 bg-zinc-50 px-1 text-[9px] text-zinc-400 font-mono">
            {message.ipAddress}
          </span>
        )}
      </div>

      {/* Bubble with soft colors */}
      <div
        className={`max-w-md rounded-2xl px-3.5 py-2 text-xs leading-relaxed transition ${
          isSelf
            ? 'bg-blue-600 text-white rounded-tr-xs shadow-2xs'
            : 'bg-white text-zinc-800 border border-zinc-200/80 rounded-tl-xs shadow-2xs'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
      </div>

      {/* Status indicator for self */}
      {isSelf && (
        <div className="flex items-center gap-0.5 mt-0.5 px-1 text-[10px] text-blue-600">
          <CheckCheck className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};
