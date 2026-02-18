import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I am your JalSanchaee Assistant. How can I help you with your farm today?", sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { id: Date.now(), text: message, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    // Simulated AI Response
    setTimeout(() => {
      let botResponse = "I am processing your request. For irrigation schedules, please use the Smart Planner tool.";
      if (message.toLowerCase().includes('water')) {
        botResponse = "Optimizing water usage is key! Have you checked your soil moisture levels on the dashboard?";
      } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        botResponse = "Hello! How can I assist you today? I can help with irrigation planning, weather updates, or crop advice.";
      }
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass-card"
            style={{ 
              width: '400px', 
              height: '600px', 
              marginBottom: '20px', 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-2xl)',
              borderRadius: '24px'
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: '24px 20px', 
              background: 'var(--primary)', 
              color: 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.25)', padding: '10px', borderRadius: '12px' }}>
                  <Bot size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '0.3px' }}>JalSanchaee AI</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></span>
                    Online • Assistant
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
                whileHover={{ background: 'rgba(255,255,255,0.25)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'transparent' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ 
                    padding: '14px 18px', 
                    borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: msg.sender === 'user' ? 'none' : 'blur(8px)',
                    WebkitBackdropFilter: msg.sender === 'user' ? 'none' : 'blur(8px)',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                    fontSize: '0.95rem',
                    boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(24, 78, 108, 0.2)' : '0 4px 12px rgba(0,0,0,0.03)',
                    lineHeight: '1.6',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
                    fontWeight: msg.sender === 'user' ? '500' : '500'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)', padding: '12px 20px', borderRadius: '20px 20px 20px 4px', display: 'flex', gap: '8px', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
                  <Loader2 size={18} className="animate-spin" color="var(--primary)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>AI is thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="glass-input"
                style={{ 
                  flex: 1, 
                  borderRadius: '24px', 
                  padding: '12px 20px',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(24, 78, 108, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                style={{ 
                  background: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '16px', 
                  width: '48px', 
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <Send size={20} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '30px', 
          background: 'var(--primary)', 
          color: 'white', 
          border: 'none', 
          boxShadow: '0 8px 24px rgba(0, 119, 182, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};

export default FloatingChat;
