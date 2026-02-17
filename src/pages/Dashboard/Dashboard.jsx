import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Wind, 
  Thermometer, 
  CloudRain, 
  ArrowUpRight, 
  Calendar,
  Zap,
  Sprout
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, unit, trend, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card" 
    style={{ padding: '24px', flex: 1, minWidth: '240px' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div style={{ 
        padding: '12px', 
        borderRadius: '12px', 
        background: `${color}15`, 
        color: color 
      }}>
        <Icon size={24} />
      </div>
      {trend && (
        <div style={{ 
          fontSize: '0.85rem', 
          color: trend > 0 ? '#10b981' : '#ef4444', 
          display: 'flex', 
          alignItems: 'center',
          fontWeight: '700'
        }}>
          {trend > 0 ? '+' : ''}{trend}%
          <ArrowUpRight size={14} style={{ marginLeft: '2px' }} />
        </div>
      )}
    </div>
    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '500' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
      <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>{value}</span>
      <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>{unit}</span>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description, delay, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02, translateY: -5 }}
    onClick={onClick}
    className="glass-card"
    style={{ 
      padding: '32px', 
      cursor: 'pointer', 
      border: '1px solid rgba(0, 119, 182, 0.1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <div style={{ 
      color: 'var(--primary)', 
      marginBottom: '20px',
      width: '56px',
      height: '56px',
      background: 'white',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0, 119, 182, 0.08)'
    }}>
      <Icon size={32} />
    </div>
    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', fontWeight: '700', color: 'var(--text-main)' }}>{title}</h3>
    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{description}</p>
  </motion.div>
);

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-light)' }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <main style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        width: '100%'
      }}>
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        
        <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
              Field Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Real-time monitoring and smart insights for your sustainable farm.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
            <StatCard icon={Droplets} label="Soil Moisture" value="32" unit="%" trend={14} color="var(--primary)" />
            <StatCard icon={Thermometer} label="Temperature" value="28" unit="°C" trend={-4} color="#f59e0b" />
            <StatCard icon={Wind} label="Wind Speed" value="12" unit="km/h" trend={8} color="#6366f1" />
            <StatCard icon={CloudRain} label="Humidity" value="68" unit="%" trend={12} color="#06b6d4" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>Quick Actions</h2>
            <button style={{ color: 'var(--primary)', fontWeight: '600', background: 'none', border: 'none' }}>View All Features</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            <FeatureCard 
              icon={Calendar} 
              title="Irrigation Planner" 
              description="Generate AI-powered schedules based on precise soil and crop metrics."
              delay={0.1}
              onClick={() => navigate('/irrigation')}
            />
            <FeatureCard 
              icon={Zap} 
              title="Pump Control" 
              description="Remotely manage your smart irrigation system with automated triggers."
              delay={0.2}
              onClick={() => navigate('/automation')}
            />
            <FeatureCard 
              icon={Sprout} 
              title="Crop Analysis" 
              description="Deep dive into crop health trends and moisture absorption patterns."
              delay={0.3}
              onClick={() => navigate('/analysis')}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
