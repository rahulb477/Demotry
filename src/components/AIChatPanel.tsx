import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { sendAIChatMessage } from '../services/api';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  uid?: string;
  userName?: string;
}

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
  isOpen,
  onClose,
  uid,
  userName,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'bot',
      text: 'Hello. I am BattleZone Assistant. How can I assist you with tournament matches, wallet deposits, or withdrawals today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: 'usr_' + Date.now(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendAIChatMessage(text, uid, userName);
      const botMsg: Message = {
        id: 'bot_' + Date.now(),
        role: 'bot',
        text: res.reply || 'Thank you for reaching out. Please verify tournament rules in the match details.',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot_' + Date.now(),
          role: 'bot',
          text: 'We are currently processing tournament updates. For immediate queries, submit a report or check match guidelines.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="aiChatPanel">
      <div className="chat-header">
        <h3 className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span>BattleZone Support</span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-2 cursor-pointer transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="chat-body" ref={scrollRef}>
        {messages.map((m) => (
          <div key={m.id} className={`chat-msg ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="chat-msg bot flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>Assistant is typing...</span>
          </div>
        )}
      </div>

      <div className="chat-footer">
        <input
          type="text"
          className="form-input"
          placeholder="Ask about deposits, withdrawals, rules..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          style={{ width: 'auto', padding: '0 20px' }}
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          <Send className="w-4 h-4 mr-1" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
