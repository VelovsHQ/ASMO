"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { MessageSquare, X, Send, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTIONS = [
  "Should I buy gold?",
  "What happened today?",
  "Why is BTC crashing?",
  "What affects Tesla?"
];

interface CopilotChatProps {
  isFloating?: boolean;
}

export default function CopilotChat({ isFloating = false }: CopilotChatProps) {
  const [isOpen, setIsOpen] = useState(!isFloating);
  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSuggestion = (text: string) => {
    append({ role: "user", content: text });
  };

  const ChatInterface = (
    <div className={`flex flex-col bg-background border border-border shadow-2xl overflow-hidden ${isFloating ? "w-[90vw] sm:w-[400px] h-[500px] sm:h-[600px] rounded-2xl" : "w-full h-full rounded-2xl"}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground leading-tight">ASMO Copilot</h3>
            <span className="text-xs text-muted-foreground">Always on</span>
          </div>
        </div>
        {isFloating && (
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-3 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
              <Sparkles size={24} className="text-accent" />
            </div>
            <p className="font-medium text-foreground">How can I help you navigate the markets today?</p>
            <p className="text-sm">Ask me about trends, anomalies, or specific assets.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${m.role === "user" ? "bg-muted" : "bg-accent text-accent-foreground"}`}>
                {m.role === "user" ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${m.role === "user" ? "bg-accent text-accent-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm whitespace-pre-wrap"}`}>
                {m.content}
              </div>
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="self-start flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-accent text-accent-foreground">
              <Sparkles size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-muted rounded-tl-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-muted/10 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestion(suggestion)}
                className="text-[11px] sm:text-xs px-3 py-1.5 bg-background border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-accent transition-colors text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-end gap-2 relative">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ask ASMO anything..."
            className="w-full bg-background border border-border rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent resize-none placeholder:text-muted-foreground min-h-[44px] max-h-32"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form) form.requestSubmit();
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center disabled:opacity-50 transition-opacity"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );

  if (!isFloating) return ChatInterface;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-xl shadow-accent/20 flex items-center justify-center hover:bg-accent/90 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 origin-bottom-right"
          >
            {ChatInterface}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
