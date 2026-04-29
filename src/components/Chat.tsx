import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Send, MessageSquare } from 'lucide-react';

export function Chat({ socket }: { socket: any }) {
  const { messages, roomId } = useStore();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    socket.emit('chat-message', {
      roomId,
      message: {
        user: socket.id.slice(0, 5),
        text: inputText,
        time: Date.now()
      }
    });

    setInputText('');
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col h-64 w-80 text-white overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <MessageSquare size={16} className="text-blue-400" />
        <span className="text-[10px] uppercase font-bold tracking-widest">In-Game Chat</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-hide"
      >
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-400 opacity-80">{msg.user}</span>
            <p className="text-xs leading-relaxed opacity-90">{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-2 bg-white/5 border-t border-white/10 flex gap-2">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message..."
          className="flex-1 bg-transparent text-xs outline-none px-2"
        />
        <button 
          type="submit"
          className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
