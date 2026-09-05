import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Mic, MicOff, Volume2, VolumeX, X, Sparkles, Bot, User } from 'lucide-react';
import { wellnessAPI } from '../services/api';

const GlowBotModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am GlowBot ✨, your AI Skincare Concierge. Ask me anything about active ingredients (Retinol, Niacinamide, BHA), acne treatments, or your custom 4-week diet protocol!"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Voice Recognition via Web Speech API
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        handleSend(transcript);
      };

      recognition.start();
    } catch (e) {
      console.warn("Speech recognition error:", e);
      setIsListening(false);
    }
  };

  // Text to Speech
  const speakText = (text) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (messageToSend = null) => {
    const text = messageToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await wellnessAPI.askChatbot(text);
      const botReply = res.data?.reply || "Maintain a gentle cleanser, targeted active, barrier moisturizer, and daily SPF!";
      
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      speakText(botReply);
    } catch (err) {
      setIsTyping(false);
      const fallback = "For radiant skin, hydrate internally with 3L water and layer hyaluronic acid under a ceramide moisturizer!";
      setMessages(prev => [...prev, { sender: 'bot', text: fallback }]);
      speakText(fallback);
    }
  };

  const quickPrompts = [
    "How to use Retinol safely?",
    "Best routine for oily T-zone?",
    "Can I combine Niacinamide with Vitamin C?",
    "Diet tips for cystic acne"
  ];

  return (
    <>
      {/* Floating Chatbot Bubble Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full btn-glow text-white shadow-glow flex items-center justify-center hover:scale-110 transition-all duration-300 group"
        title="Chat with GlowBot AI"
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-8 z-40 w-[92vw] sm:w-96 glass-panel rounded-3xl shadow-2xl border border-pink-200 dark:border-pink-900/60 flex flex-col h-[520px] overflow-hidden animate-fadeIn">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-glow-primary via-pink-500 to-glow-accent text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-none">GlowBot AI Concierge</h4>
                <span className="text-[10px] text-pink-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  Voice & Clinical Assistant Online
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white"
                title={speechEnabled ? "Mute Voice Speech" : "Enable Voice Readout"}
              >
                {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-pink-50/20 dark:bg-black/20 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-950 text-glow-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles size={12} />
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-glow-primary text-white font-medium rounded-br-none shadow-sm'
                      : 'bg-white dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/60 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-gray-400 text-[11px]">
                <div className="w-2 h-2 rounded-full bg-glow-primary animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-glow-primary animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-glow-primary animate-bounce [animation-delay:0.4s]" />
                <span>GlowBot is consulting dermatological research...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="p-2 border-t border-pink-100 dark:border-pink-950/40 bg-white/60 dark:bg-glow-dark-surface/60 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-pink-50 dark:bg-pink-950/50 text-glow-primary hover:bg-pink-100 transition-colors border border-pink-200/50 flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input & Voice Controls */}
          <div className="p-3 bg-white dark:bg-glow-dark-card border-t border-pink-100 dark:border-pink-950/40 flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`p-2 rounded-xl border transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                  : 'text-gray-500 hover:text-glow-primary border-pink-100 dark:border-pink-950/60'
              }`}
              title={isListening ? "Listening... Speak now" : "Speak Voice Question"}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              placeholder="Ask about active ingredients..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/40 dark:bg-glow-dark-surface focus:outline-none focus:ring-1 focus:ring-glow-primary"
            />

            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-glow-primary text-white hover:bg-glow-primary-dark transition-colors"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default GlowBotModal;
