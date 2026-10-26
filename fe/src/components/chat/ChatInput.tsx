import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';

interface ChatInputProps {
  roomName: string;
  onSendMessage: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
}

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '🔥', '🐧', '💻', '🚀'];

export const ChatInput: React.FC<ChatInputProps> = ({
  roomName,
  onSendMessage,
  onTyping,
}) => {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
    onTyping(false);
    setShowEmojis(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    onTyping(true);
  };

  const handleAddEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  return (
    <div className="p-3 bg-white border-t border-zinc-200/80">
      {/* Quick Emoji Bar */}
      {showEmojis && (
        <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-1.5 shadow-2xs">
          <span className="text-[10px] text-zinc-400 font-medium px-1">Emoji:</span>
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="rounded p-1 text-sm hover:bg-white hover:shadow-2xs transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          title="Chọn biểu tượng cảm xúc"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
            showEmojis ? 'bg-zinc-200 text-zinc-800' : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700'
          }`}
        >
          <Smile className="h-4 w-4" />
        </button>

        <input
          type="text"
          placeholder={`Nhập tin nhắn vào kênh #${roomName}...`}
          value={text}
          onChange={handleInputChange}
          className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="flex h-8 px-3 shrink-0 items-center gap-1 rounded-lg bg-blue-600 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600"
        >
          <span>Gửi</span>
          <Send className="h-3 w-3" />
        </button>
      </form>

      <div className="mt-1 flex items-center px-1 text-[10px] text-zinc-400">
        <span>Nhấn Enter để gửi tin</span>
      </div>
    </div>
  );
};
