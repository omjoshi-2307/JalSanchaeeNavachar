import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';

const PlaceholderPage = ({ title, icon: Icon, description }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />

      <main style={{
        flex: 1,
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'var(--transition)',
        minHeight: '100vh'
      }}>
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

        <div style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 80px)',
          textAlign: 'center'
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card"
            style={{ 
              padding: '60px', 
              maxWidth: '600px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid var(--glass-border)'
            }}
          >
            <div style={{
              color: 'var(--primary)',
              marginBottom: '24px',
              display: 'inline-flex',
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(0, 119, 182, 0.15)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(8px)'
            }}>
              <Icon size={64} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)' }}>{title}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
              {description}
            </p>
            <div style={{
              padding: '14px 28px',
              background: 'var(--primary)',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: '800',
              color: 'white',
              boxShadow: '0 4px 14px rgba(24, 78, 108, 0.3)',
              display: 'inline-block'
            }}>
              Coming Soon in the Next Update
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PlaceholderPage;
