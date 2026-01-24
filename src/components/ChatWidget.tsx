"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi there! Welcome to Afro Essence. How can I help you today?", isUser: false },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = inputValue;
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "Thanks for reaching out! One of our hair specialists will be with you shortly.";
      
      if (userMessage.toLowerCase().includes("shipping")) {
        botResponse = "We ship worldwide! Standard shipping takes 3-5 business days.";
      } else if (userMessage.toLowerCase().includes("return")) {
        botResponse = "We accept returns within 30 days of purchase if the hair is unopened.";
      } else if (userMessage.toLowerCase().includes("hair")) {
        botResponse = "We offer a variety of textures including Kinky Curly, Deep Wave, and Straight. Which one are you interested in?";
      }

      setMessages((prev) => [...prev, { text: botResponse, isUser: false }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-zinc-900 w-80 sm:w-96 rounded-lg shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-primary p-4 flex justify-between items-center text-white">
            <div>
              <h3 className="font-bold">Afro Essence Support</h3>
              <p className="text-xs opacity-90">Online</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-zinc-950">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                    msg.isUser
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-zinc-800 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-md hover:bg-opacity-90 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center"
      >
        {isOpen ? (
           <X className="h-6 w-6" />
        ) : (
           <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
