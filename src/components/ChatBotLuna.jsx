"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBotLuna() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Halo! Aku Luna, asisten pribadinya Lana. Ada yang mau kamu tanyakan tentang Lana?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg,
          history: messages // Kirim riwayat pesan
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply || data.error }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Luna gagal konek ke server nih. Coba lagi ya!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Chat Box */}
      {isOpen && (
        <div className="mb-4 w-[330px] h-[480px] bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-accent/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#1e293b] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <i className="bx bxs-moon text-b900 text-lg"></i>
              </div>
              <span className="font-bold text-white">Luna</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-accent transition-colors">
              <i className="bx bx-chevron-down text-2xl"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[0.85rem] leading-relaxed ${
                  msg.role === "user" 
                  ? "bg-accent text-b900 rounded-br-none shadow-sm" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Tanya Luna..." 
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-[0.9rem] outline-none focus:border-accent transition-all text-slate-900 dark:text-white"
              />
              <button 
                onClick={handleSend}
                className="w-10 h-10 bg-accent text-b900 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <i className="bx bxs-send text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-[#1e293b] border-2 border-accent shadow-2xl flex items-center justify-center overflow-hidden hover:scale-110 active:scale-95 transition-all duration-300 relative group"
      >
        <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <img src="/images/luna.webp" alt="Luna" className="w-full h-full object-cover" />
      </button>
    </div>
  );
}
