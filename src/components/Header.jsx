import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User, Search, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header style={{
      height: '80px',
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0,119,182,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={onMenuClick}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
        >
          <Menu size={24} />
        </button>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search resources..."
            style={{
              padding: '10px 15px 10px 40px',
              borderRadius: '20px',
              border: '1px solid rgba(0,119,182,0.1)',
              background: 'white',
              width: '250px',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', position: 'relative' }}>
          <Bell size={20} />
          <span style={{ 
            position: 'absolute', 
            top: '-2px', 
            right: '-2px', 
            width: '8px', 
            height: '8px', 
            background: '#ef4444', 
            borderRadius: '50%',
            border: '2px solid white'
          }} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid rgba(0,119,182,0.1)', paddingLeft: '24px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.displayName || 'Farmer User'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'var(--accent)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--primary)',
            fontWeight: '700'
          }}>
            {user?.displayName ? user.displayName[0] : <User size={20} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
