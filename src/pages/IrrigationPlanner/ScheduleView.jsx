import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Calendar, BarChart3, Info, RotateCcw } from 'lucide-react';

const ScheduleView = ({ scheduleData, onReset }) => {
  if (!scheduleData) return null;

  const { summary, schedule } = scheduleData;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="schedule-container"
      style={{ marginTop: '30px' }}
    >
      <div className="glass-card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
              Optimized Irrigation Schedule
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Tailored for {summary.cropName} on your farm</p>
            {summary.weatherNotice && (
              <div style={{ 
                marginTop: '12px', 
                padding: '8px 16px', 
                background: '#fef3c7', 
                color: '#92400e', 
                borderRadius: '8px', 
                fontSize: '0.85rem', 
                fontWeight: '600',
                display: 'inline-block'
              }}>
                {summary.weatherNotice}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={onReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(0, 119, 182, 0.2)',
                background: 'white',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-muted)'
              }}
            >
              <RotateCcw size={16} /> Reset
            </button>
            <div className="summary-badge" style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '10px 20px', 
              borderRadius: '12px',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Total Monthly Water</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{summary.totalMonthlyWater.toLocaleString()} L</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {schedule.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.5)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: 'var(--primary)' }}>
                <Calendar size={18} />
                <span style={{ fontWeight: '600' }}>Week {item.week}</span>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                {item.waterQuantityLiters.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>L</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                <Droplets size={14} /> {item.frequency}
              </div>
              <p style={{ fontSize: '0.8rem', marginTop: '16px', color: 'var(--text-main)', lineHeight: '1.5' }}>
                {item.instructions}
              </p>
            </motion.div>
          ))}
        </div>

        <div style={{ 
          background: 'rgba(0, 119, 182, 0.05)', 
          padding: '24px', 
          borderRadius: '16px',
          display: 'flex',
          gap: '16px'
        }}>
          <Info size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '6px', color: 'var(--text-main)' }}>Expert Insight</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              This schedule optimizes for a seasonal multiplier of {summary.metrics.seasonalMultiplier}. 
              The irrigation frequency of {summary.averageFrequency} ensures maximal soil absorption 
              while maintaining deep root hydration for {summary.cropName}.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleView;
