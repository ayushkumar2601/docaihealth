
import React, { useState, useEffect, useRef } from 'react';
import { UI_CLASSES } from '../constants';
import { createHealthChat } from '../services/geminiService';
import { speakText } from '../services/elevenlabsService';
import { UserProfile } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const CACHE_KEY = 'ai360_chatbot_cache';

const Chatbot: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello. I am your AI Health Assistant. How can I help you today? Please remember I am not a medical professional." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);
  const [isTtsLoading, setIsTtsLoading] = useState<number | null>(null);
  
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<Record<string, string>>({});

  useEffect(() => {
    // Load local cache
    const savedCache = localStorage.getItem(CACHE_KEY);
    if (savedCache) {
      try {
        cacheRef.current = JSON.parse(savedCache);
      } catch (e) {
        console.error("Failed to parse chatbot cache", e);
      }
    }

    chatRef.current = createHealthChat(`You are a professional medical assistant chatbot. 
    User Profile: ${user.name}, Age: ${user.age}, Goal: ${user.goal}.
    
    CORE RULES:
    1. AUTOMATIC LANGUAGE MATCHING: Respond in the exact language of the user.
    2. FORMATTING: Use **Double Asterisks** for headings and critical vulnerabilities. 
    3. CLEANLINESS: NEVER use single asterisks (*) for bullet points or lists. Use plain dashes (-) or simple new lines.
    4. Maintain a professional, minimalist, and clinical tone.
    5. MANDATORY DISCLAIMER: Every response must imply you are an AI assistant and not a medical professional.`);

    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
    };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatMessage = (text: string) => {
    if (!text) return '';
    // 1. Temporarily replace valid double-asterisk bold markers
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '___BOLD_START___$1___BOLD_END___');
    // 2. Remove all stray asterisks (including list markers)
    formatted = formatted.replace(/\*/g, ''); 
    // 3. Restore bold with styling
    formatted = formatted.replace(/___BOLD_START___/g, '<strong class="font-bold text-neutral-900 underline-offset-4 decoration-neutral-100 decoration-2">')
                         .replace(/___BOLD_END___/g, '</strong>');
    return formatted;
  };

  const saveToCache = (query: string, response: string) => {
    const key = query.trim().toLowerCase();
    cacheRef.current[key] = response;
    const entries = Object.entries(cacheRef.current);
    if (entries.length > 50) {
      const limited = Object.fromEntries(entries.slice(-50));
      cacheRef.current = limited;
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheRef.current));
  };

  const handleSpeak = async (text: string, index: number) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      setActiveAudioIndex(null);
    }

    setIsTtsLoading(index);
    try {
      const audio = await speakText(text.replace(/\*/g, '')); // Clean text for TTS
      if (audio) {
        currentAudioRef.current = audio;
        setActiveAudioIndex(index);
        audio.onended = () => setActiveAudioIndex(null);
      }
    } catch (err) {
      console.error("Speech playback failed", err);
    } finally {
      setIsTtsLoading(null);
    }
  };

  const handleSend = async (overrideInput?: string) => {
    const userMsg = overrideInput || input;
    if (!userMsg.trim() || loading) return;

    const normalizedQuery = userMsg.trim().toLowerCase();
    
    if (cacheRef.current[normalizedQuery]) {
      const cachedResponse = cacheRef.current[normalizedQuery];
      const newMessages: Message[] = [
        ...messages,
        { role: 'user', text: userMsg },
        { role: 'model', text: cachedResponse }
      ];
      setMessages(newMessages);
      setInput('');
      if (voiceOn) handleSpeak(cachedResponse, newMessages.length - 1);
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const result = await chatRef.current.sendMessageStream({ message: userMsg });
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        setMessages(prev => {
          const newMsgs = [...prev];
          const lastIdx = newMsgs.length - 1;
          if (newMsgs[lastIdx].role === 'model') {
            newMsgs[lastIdx] = { ...newMsgs[lastIdx], text: fullText };
          }
          return newMsgs;
        });
      }

      saveToCache(userMsg, fullText);
      if (voiceOn) handleSpeak(fullText, messages.length + 1);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an issue connecting to my medical intelligence engine. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    "Explain my last report",
    "What are early signs of hypertension?",
    "Healthy diet for heart health",
    "Understanding cholesterol levels"
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-2xl shadow-black/[0.03] border border-neutral-100 overflow-hidden animate-reveal">
      <header className="px-10 py-6 border-b border-neutral-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white text-base shadow-sm">✦</div>
           <div>
              <p className="text-sm font-bold text-neutral-900 tracking-tight">Health Assistant</p>
              <div className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                 <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6B705C]">System Online • Optimized</p>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setVoiceOn(!voiceOn)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all text-[9px] font-bold uppercase tracking-widest ${voiceOn ? 'bg-neutral-900 border-black text-white shadow-lg shadow-black/10' : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:text-neutral-900'}`}
          >
            {voiceOn ? '🔊 Audio Assist On' : '🔇 Audio Assist Off'}
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-10 py-10 space-y-8 scroll-smooth bg-[#FAF9F6]/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-reveal`}>
            <div className={`max-w-[80%] ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-6 rounded-[2rem] transition-all text-[15px] font-medium leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#1A1A1A] text-white shadow-xl shadow-black/10 rounded-tr-none' : 'bg-white border border-neutral-100 text-neutral-800 rounded-tl-none'}`}>
                <div 
                  className="whitespace-pre-wrap prose prose-neutral max-w-none" 
                  dangerouslySetInnerHTML={{ __html: formatMessage(m.text) }} 
                />
                {m.role === 'model' && m.text === '' && (
                  <div className="flex gap-1.5 py-2">
                    <span className="w-2 h-2 bg-neutral-200 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-neutral-200 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-neutral-200 rounded-full animate-bounce"></span>
                  </div>
                )}
              </div>
              
              {m.role === 'model' && m.text !== '' && (
                <div className="mt-3 flex items-center gap-4 px-3">
                  <button 
                    onClick={() => handleSpeak(m.text, i)}
                    disabled={isTtsLoading !== null}
                    className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${activeAudioIndex === i ? 'text-neutral-900' : 'text-neutral-300 hover:text-neutral-600'}`}
                  >
                    {isTtsLoading === i ? (
                      <span className="flex gap-1">
                        <span className="w-1 h-1 bg-neutral-900 rounded-full animate-pulse"></span>
                        <span className="w-1 h-1 bg-neutral-900 rounded-full animate-pulse delay-75"></span>
                        <span className="w-1 h-1 bg-neutral-900 rounded-full animate-pulse delay-150"></span>
                      </span>
                    ) : activeAudioIndex === i ? (
                      <span className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 opacity-20"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-900"></span>
                        </span>
                        Voice Playback Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 group">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">🔊</span>
                        Read Aloud
                      </span>
                    )}
                  </button>
                  <span className="w-1 h-1 bg-neutral-100 rounded-full"></span>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-200">DocAi Intelligence</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-10 py-8 border-t border-neutral-50 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        {/* Quick Action Chips - Removed after first interaction */}
        {messages.length <= 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 animate-fade-in">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(action)}
                disabled={loading}
                className="whitespace-nowrap px-5 py-2 rounded-full bg-neutral-50/50 border border-neutral-100 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 hover:border-neutral-300 hover:bg-white transition-all active:scale-95 shadow-sm"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about your health or medical reports..."
              className="w-full bg-neutral-50/50 border border-neutral-100 pl-6 pr-6 py-5 text-[15px] font-medium rounded-2xl focus:outline-none focus:bg-white focus:border-neutral-200 focus:ring-4 focus:ring-neutral-900/[0.02] transition-all placeholder:text-neutral-300 shadow-sm"
            />
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-16 h-16 bg-[#1A1A1A] text-white rounded-2xl flex items-center justify-center hover:bg-black hover:scale-[1.02] transition-all disabled:opacity-30 active:scale-95 shadow-xl shadow-black/10"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="text-xl">→</span>
            )}
          </button>
        </div>
        <div className="mt-6 flex justify-between items-center px-2">
           <div className="flex gap-4 text-[8px] font-bold uppercase tracking-[0.25em] text-neutral-200">
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-neutral-200 rounded-full"></span> Gemini 3 Pro</span>
              <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-neutral-200 rounded-full"></span> Secure Sandbox</span>
           </div>
           <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-300">End-to-End Encrypted Session</p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
