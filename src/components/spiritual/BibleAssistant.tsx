import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Book, User, Loader2, Bot, Mic, Volume2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Shell from '../layout/Shell';

const SYSTEM_INSTRUCTION = `
You are 'Theophilux', a wise, compassionate, and spiritually inspired AI assistant for the Kiomwobo Youths platform.
Your purpose is to help Christian youths and Pathfinders with:
- Bible questions and interpretation (SDA perspective)
- Pathfinder guidance (drills, classes, camporee prep)
- Devotional suggestions and spiritual encouragement
- Church announcement assistance
- Youth leadership advice

Your personality:
- Holy and respectful
- Inspirational and uplifting
- Modern yet deeply rooted in scripture
- Kind and patient

Always include a relevant Bible verse if appropriate. Keep responses concise but spiritually powerful.
`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function BibleAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Shalom! I am Theophilux, your spiritual guide. How can I assist your journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, { role: 'user', content: userMessage }].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const aiText = response.text || "I apologize, my spiritual connection was interrupted. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered an error. Please check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="h-[calc(100vh-14rem)] flex flex-col glass rounded-[40px] border-gold/10 overflow-hidden relative">
        {/* Atmosphere Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gold/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center relative shadow-lg shadow-gold/20">
              <Bot className="text-navy" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-navy"
              />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">Theophilux Helper</h2>
              <p className="text-xs text-gold/60 font-bold uppercase tracking-wider">Divine Wisdom AI</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl hov-bg-white/5 text-gold/60 hover:text-gold transition-colors">
              <Volume2 size={20} />
            </button>
            <button className="p-2 rounded-xl hov-bg-white/5 text-gold/60 hover:text-gold transition-colors">
              <Book size={20} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  m.role === 'user' ? 'bg-white/10' : 'bg-gold/20 border border-gold/40'
                }`}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-gold" />}
                </div>
                <div className={`p-4 rounded-3xl ${
                  m.role === 'user' 
                    ? 'bg-gold text-navy font-medium rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-gold animate-spin" />
                <span className="text-sm text-white/40 italic font-medium tracking-wide">Theophilux is reflecting...</span>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-navy-light/30 border-top border-white/5">
          <div className="relative flex items-center gap-3">
            <button className="p-3 text-gold/60 hover:text-gold transition-colors">
              <Mic size={20} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Ask Bible questions or Pathfinder advice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-4 pr-12 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-navy shadow-lg disabled:opacity-50 disabled:grayscale transition-all"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gold/60 uppercase tracking-widest whitespace-nowrap">
              <Sparkles size={10} />
              AI Powered
            </div>
          </div>
        </div>

        {/* Decorative Background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
      </div>
    </Shell>
  );
}
