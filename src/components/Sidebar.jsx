import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Droplets, 
  History, 
  Settings, 
  LogOut, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Irrigation Planner', icon: Droplets, path: '/irrigation' },
    { name: 'History', icon: History, path: '/history' },
    { name: 'Help & Support', icon: HelpCircle, path: '/support' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onToggle}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(4px)',
            zIndex: 40
          }}
        />
      )}

      <aside 
        className="glass-panel-deep"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '280px',
          borderRight: '1px solid var(--glass-border)',
          zIndex: 50,
          padding: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'var(--transition)',
          boxShadow: '4px 0 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '0 24px 24px 0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 10px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'var(--primary)', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Droplets size={24} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>JalSanchaee</span>
          <button onClick={onToggle} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)' }} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onToggle()}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                color: isActive ? 'var(--white)' : 'var(--text-muted)',
                background: isActive ? 'var(--primary)' : 'transparent',
                fontWeight: isActive ? '700' : '500',
                transition: 'var(--transition)',
                boxShadow: isActive ? '0 4px 12px rgba(24, 78, 108, 0.2)' : 'none'
              })}
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(0,119,182,0.1)', paddingTop: '20px' }}>
          <button
            onClick={() => authService.logout()}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.05)',
              border: 'none',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
