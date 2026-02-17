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
              width: '380px', 
              height: '500px', 
              marginBottom: '20px', 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0, 119, 182, 0.2)'
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: '20px', 
              background: 'var(--primary)', 
              color: 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '10px' }}>
                  <Bot size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>JalSanchaee AI</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Online • Ready to help</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white' }}>
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', background: 'rgba(255,255,255,0.4)' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ 
                    padding: '12px 16px', 
                    borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                    background: msg.sender === 'user' ? 'var(--primary)' : 'white',
                    color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    lineHeight: '1.5'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'white', padding: '8px 16px', borderRadius: '18px 18px 18px 0', display: 'flex', gap: '4px' }}>
                  <Loader2 size={16} className="animate-spin" color="var(--primary)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI is thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '15px', background: 'white', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything..."
                style={{ 
                  flex: 1, 
                  border: '1px solid rgba(0,119,182,0.1)', 
                  borderRadius: '20px', 
                  padding: '10px 15px',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button 
                type="submit"
                style={{ 
                  background: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={18} />
              </button>
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
