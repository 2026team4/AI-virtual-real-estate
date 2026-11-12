import { useState, useEffect, useRef } from 'react';
import { chatbotAPI } from '../../services/api';
import { MessageSquare, X, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';

const WELCOME = {
  id: 'welcome',
  role: 'bot',
  text: `Hello! 👋 I'm your AI real estate assistant.\n\nI can help you with:\n🏠 Finding properties\n💰 Price estimates\n📋 Listing your property\n📅 Booking visits\n\nWhat are you looking for today?`,
  time: new Date(),
};

export default function ChatbotWidget() {
  const [open,        setOpen]        = useState(false);
  const [messages,    setMessages]    = useState([WELCOME]);
  const [input,       setInput]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [unread,      setUnread]      = useState(0);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Load suggestions on mount
  useEffect(() => {
    chatbotAPI.suggestions()
      .then(({ data }) => setSuggestions(data.suggestions || []))
      .catch(() => {});
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 100); setUnread(0); }
  }, [open]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: msg, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await chatbotAPI.send(msg);
      const botMsg = { id: Date.now() + 1, role: 'bot', text: data.reply, time: new Date() };
      setMessages((prev) => [...prev, botMsg]);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1, role: 'bot',
        text: 'Sorry, I\'m having trouble right now. Please try again in a moment.',
        time: new Date(), isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => setMessages([WELCOME]);

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Format newlines in bot messages
  const formatText = (text) =>
    text.split('\n').map((line, i) => (
      <span key={i}>{line}{i < text.split('\n').length - 1 && <br />}</span>
    ));

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          open ? 'bg-gray-700 rotate-90' : 'bg-primary-600 hover:bg-primary-700'
        }`}
        aria-label="Chat with AI Assistant"
      >
        {open ? <X size={22} className="text-white" /> : <MessageSquare size={24} className="text-white" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl border border-gray-100 bg-white overflow-hidden animate-slide-up"
          style={{ height: '520px' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI Real Estate Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/70 text-xs">Always online</span>
                </div>
              </div>
            </div>
            <button onClick={clearChat} title="Clear chat"
              className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors">
              <RefreshCw size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-1 ${
                  m.role === 'bot' ? 'bg-primary-100' : 'bg-gray-200'
                }`}>
                  {m.role === 'bot'
                    ? <Bot size={14} className="text-primary-600" />
                    : <User size={14} className="text-gray-500" />
                  }
                </div>
                {/* Bubble */}
                <div className={`max-w-[78%] group`}>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : m.isError
                        ? 'bg-red-50 text-red-600 border border-red-100 rounded-bl-md'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                  }`}>
                    {formatText(m.text)}
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 ${m.role === 'user' ? 'text-right' : ''}`}>
                    {formatTime(m.time)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                  <Bot size={14} className="text-primary-600" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    {[0,1,2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && suggestions.length > 0 && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto">
              {suggestions.slice(0, 4).map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="flex-shrink-0 text-xs bg-white border border-gray-200 hover:border-primary-400 hover:text-primary-700 text-gray-600 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about properties, prices, tours…"
              rows={1}
              className="flex-1 input-field py-2.5 text-sm resize-none min-h-[42px] max-h-24"
              style={{ lineHeight: '1.4' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
