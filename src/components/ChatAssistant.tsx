import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Sparkles, RefreshCw, AlertCircle, HelpCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatAssistantProps {
  lang?: "en" | "so";
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ lang = "en" }) => {
  const chatT = {
    en: {
      welcome: "Asalaamu Alaykum! I am the Baane Logistics Sourcing & Cargo AI Advisor. I can help you find manufacturers in Chinese trade hubs (like Yiwu and Guangzhou), explain our secure escrow agent payments, and calculate container sizes for shipping to Somaliland. What are you importing today?",
      suggestionPrompts: [
        { text: "Secure Escrow", label: "How does payment protection work?" },
        { text: "Yiwu Sourcing", label: "Sourcing goods from Yiwu Markets" },
        { text: "Berbera Customs", label: "Customs clearance at Berbera Port" },
        { text: "Sea vs Air Cargo", label: "Shipping container dimensions & times" },
      ],
      title: "Baane AI Sourcing Agent",
      status: "Gemini 3.5 Core • Online",
      resetTitle: "Reset Conversation",
      loading: "AI Agent is analyzing trade regulations...",
      placeholder: "Type your China-Somaliland logistics query...",
      error: "AI connection failure. Click retry to re-establish satellite link."
    },
    so: {
      welcome: "Asalaamu Alaykum! Waxaan ahay Caawiyaha Sourcing-ka iyo Cargo-da ee Baane Logistics. Waxaan kaa caawin karaa helitaanka warshado ku yaal magaalooyinka ganacsiga Shiinaha (sida Yiwu iyo Guangzhou), sharaxaadda escrow-ga ammaanka ah, iyo xisaabinta konteynarada u dhoofaya Somaliland. Maxaad rabtaa inaad soo raddo maanta?",
      suggestionPrompts: [
        { text: "Escrow Ammaan Ah", label: "Sidee u shaqeeyaa nidaamka ilaalinta lacagta?" },
        { text: "Sourcing-ka Yiwu", label: "Sourcing-ka alaabta ka timaada suuqyada Yiwu" },
        { text: "Kastamka Berbera", label: "Habka kastamka ee Dekedda Berbera" },
        { text: "Air vs Sea Cargo", label: "Cabbirrada konteynarka iyo masiirka rarka" },
      ],
      title: "Baane AI Caawiye",
      status: "Gemini 3.5 Core • Diyaar",
      resetTitle: "Dib u bilaabo wadahadalka",
      loading: "Aaladda AI waxay baadhaysaa xeerarka ganacsiga...",
      placeholder: "Geli su'aashaada ku saabsan Shiinaha iyo Somaliland...",
      error: "Xidhiidhka AI waa go'ay. Fadlan dib u tijaabi."
    }
  }[lang];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: chatT.welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Update initial message when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome") {
        return [
          {
            id: "welcome",
            role: "assistant",
            content: chatT.welcome,
            timestamp: prev[0].timestamp,
          }
        ];
      }
      return prev;
    });
  }, [lang]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      // Build brief context history for the API call (recent 10 messages)
      const contextHistory = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: contextHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to contact the AI routing mainframe.");
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: data.text || "I apologize, but my satellite connection dropped. Let me retry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(chatT.error);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: chatT.welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setError("");
  };

  return (
    <div className="bg-brand-navy border border-brand-teal/20 rounded-2xl shadow-xl flex flex-col h-[550px] relative overflow-hidden">
      {/* Laser Glow top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-teal to-transparent" />

      {/* Chat Header */}
      <div className="p-4 border-b border-brand-teal/15 flex items-center justify-between bg-brand-navy/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-teal/15 p-2 rounded-xl border border-brand-teal/30 relative">
            <Bot className="h-5 w-5 text-brand-teal" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-brand-navy animate-pulse" />
          </div>
          <div>
            <h4 className="font-display text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              {chatT.title}
              <Sparkles className="h-3.5 w-3.5 text-brand-gold animate-pulse" />
            </h4>
            <span className="font-mono text-[9px] text-brand-teal uppercase tracking-widest font-bold">
              {chatT.status}
            </span>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-gray-400 hover:text-brand-teal p-1.5 rounded-lg border border-transparent hover:border-brand-teal/10 transition-all"
          title={chatT.resetTitle}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Message Output Frame */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#030d1a]/40 relative">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,212,170,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {messages.map((msg) => {
          const isAI = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isAI ? "self-start" : "self-end ml-auto flex-row-reverse"
              }`}
            >
              {/* Avatar */}
              <div className={`p-1.5 rounded-lg border shrink-0 ${
                isAI
                  ? "bg-brand-teal/10 border-brand-teal/20 text-brand-teal"
                  : "bg-brand-gold/10 border-brand-gold/20 text-brand-gold"
              }`}>
                {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                isAI
                  ? "bg-brand-navy border border-brand-teal/10 text-gray-200"
                  : "bg-[#0A2540] border border-brand-gold/25 text-white"
              }`}>
                {/* Process simple markdown lists inside content */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content.split("\n").map((line, i) => {
                    if (line.trim().startsWith("*") || line.trim().startsWith("-")) {
                      return (
                        <span key={i} className="block pl-3 relative mt-1">
                          <span className="absolute left-0 text-brand-teal">•</span>
                          {line.substring(2)}
                        </span>
                      );
                    }
                    return <span key={i} className="block mt-0.5">{line}</span>;
                  })}
                </div>
                <span className="text-[8px] font-mono text-gray-500 mt-1 block text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-2.5 max-w-[85%] self-start">
            <div className="p-1.5 rounded-lg border bg-brand-teal/10 border-brand-teal/20 text-brand-teal animate-spin">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-brand-navy border border-brand-teal/10 rounded-2xl p-3 text-xs text-gray-400 flex items-center gap-2">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
              {chatT.loading}
            </div>
          </div>
        )}

        {/* Error notification block */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-xs font-mono max-w-[90%] mx-auto">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => {
                setError("");
                const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
                if (lastUserMsg) handleSendMessage(lastUserMsg.content);
              }}
              className="text-brand-teal hover:text-white px-2 py-1 rounded border border-brand-teal/30 hover:bg-brand-teal/10 transition-all shrink-0 text-[10px] font-bold uppercase"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompts Section */}
      <div className="px-4 py-2 border-t border-brand-teal/10 bg-brand-navy/60 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <HelpCircle className="h-3.5 w-3.5 text-brand-teal shrink-0" />
        {chatT.suggestionPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.label)}
            disabled={loading}
            className="text-[10px] font-sans border border-brand-teal/15 bg-brand-navy/90 hover:border-brand-teal text-gray-300 hover:text-white px-2.5 py-1 rounded-full transition-all shrink-0"
          >
            {p.text}
          </button>
        ))}
      </div>

      {/* Input Tray */}
      <div className="p-3 border-t border-brand-teal/15 bg-[#030d1a]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
            placeholder={chatT.placeholder}
            className="w-full bg-brand-navy/90 border border-brand-teal/20 focus:border-brand-teal rounded-xl py-2.5 pl-3 pr-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-teal"
            disabled={loading}
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={loading || !input.trim()}
            className="absolute right-2 p-1.5 text-brand-teal hover:text-brand-gold disabled:text-gray-600 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatAssistant);
