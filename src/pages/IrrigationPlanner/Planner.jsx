import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { irrigationService } from '../../services/irrigationService';
import ScheduleView from './ScheduleView';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  Sprout, 
  MapPin, 
  CloudSun, 
  Layers, 
  Clock, 
  Waves, 
  ChevronRight, 
  Loader2,
  CheckCircle2,
  Droplets // Fixed missing import
} from 'lucide-react';

const Planner = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  
  const [formData, setFormData] = useState({
    area: '',
    unit: 'acres',
    cropName: '',
    season: 'Kharif',
    soilType: 'Loamy',
    availability: '4hours /day',
    waterSources: []
  });

  const waterSourceOptions = [
    { id: 'canal', label: 'Canal', icon: Waves },
    { id: 'borewell', label: 'Borewell', icon: MapPin },
    { id: 'pond', label: 'Pond', icon: Droplets },
    { id: 'drip', label: 'Drip', icon: Droplets },
    { id: 'sprinkler', label: 'Sprinkler', icon: CloudSun },
    { id: 'river', label: 'River', icon: Waves }
  ];

  const handleSourceToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      waterSources: prev.waterSources.includes(id)
        ? prev.waterSources.filter(s => s !== id)
        : [...prev.waterSources, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await irrigationService.generateSchedule(user.uid, formData);
      setSchedule(result);
      toast.success('Irrigation schedule generated!');
    } catch (error) {
      toast.error('Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-light)' }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <main style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? '280px' : '0', // Fixed margin behavior
        transition: 'all 0.3s ease'
      }}>
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>
              Smart Irrigation Planner
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Data-driven water management for sustainable farming</p>
          </header>

          <AnimatePresence mode="wait">
            {!schedule ? (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit} 
                className="glass-card" 
                style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                  <div className="input-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px' }}>
                      <MapPin size={18} color="var(--primary)" /> Farm Area
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input 
                        type="number" 
                        required
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        placeholder="Enter area"
                        className="auth-input"
                      />
                      <select 
                        className="auth-input" 
                        style={{ width: '120px', padding: '12px' }}
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      >
                        <option>Acres</option>
                        <option>Hectares</option>
                        <option>Sq Ft</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px' }}>
                      <Sprout size={18} color="var(--primary)" /> Crop Details
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.cropName}
                      onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                      placeholder="e.g. Rice, Wheat"
                      className="auth-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px' }}>
                  <div className="input-group">
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Season</label>
                    <select 
                      className="auth-input" 
                      style={{ padding: '12px' }}
                      value={formData.season}
                      onChange={(e) => setFormData({...formData, season: e.target.value})}
                    >
                      <option>Kharif</option>
                      <option>Rabi</option>
                      <option>Zaid</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Soil Texture</label>
                    <select 
                      className="auth-input" 
                      style={{ padding: '12px' }}
                      value={formData.soilType}
                      onChange={(e) => setFormData({...formData, soilType: e.target.value})}
                    >
                      <option>Loamy</option>
                      <option>Sandy</option>
                      <option>Clay</option>
                      <option>Silt</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Availability Schedule</label>
                    <input 
                      type="text" 
                      value={formData.availability}
                      onChange={(e) => setFormData({...formData, availability: e.target.value})}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '16px' }}>
                    <Layers size={18} color="var(--primary)" /> Water Sources
                  </label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {waterSourceOptions.map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSourceToggle(option.id)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '20px',
                          border: '1px solid var(--primary)',
                          background: formData.waterSources.includes(option.id) ? 'var(--primary)' : 'transparent',
                          color: formData.waterSources.includes(option.id) ? 'white' : 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <option.icon size={16} />
                        {option.label}
                        {formData.waterSources.includes(option.id) && <CheckCircle2 size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                  style={{ padding: '18px', fontSize: '1.1rem' }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>Generate My Schedule <ChevronRight size={20} /></>
                  )}
                </button>
              </motion.form>
            ) : (
              // Passing result to scheduleData to match child component
              <ScheduleView scheduleData={schedule} onReset={() => setSchedule(null)} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Planner;
