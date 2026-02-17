import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';

const PlaceholderPage = ({ title, icon: Icon, description }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-light)' }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />

      <main style={{
        flex: 1,
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s ease',
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
            style={{ padding: '60px', maxWidth: '600px' }}
          >
            <div style={{
              color: 'var(--primary)',
              marginBottom: '24px',
              display: 'inline-flex',
              padding: '20px',
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 8px 30px rgba(0, 119, 182, 0.1)'
            }}>
              <Icon size={64} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)' }}>{title}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
              {description}
            </p>
            <div style={{
              padding: '12px 24px',
              background: 'rgba(0, 119, 182, 0.05)',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--primary)'
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
