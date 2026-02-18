import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { weatherService } from '../../services/weatherService';
import { 
  Droplets, 
  Wind, 
  Thermometer, 
  CloudRain, 
  ArrowUpRight, 
  Calendar,
  Zap,
  Sprout,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const CustomTooltip = ({ active, payload, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        style={{ 
          padding: '12px', 
          background: 'rgba(255, 255, 255, 0.4)', 
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-2xl)'
        }}
      >
        <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>{payload[0].payload.name}</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '800' }}>
          {payload[0].value} {unit}
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon: Icon, label, value, unit, trend, color, isLoading, isActive, onClick }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    onClick={onClick}
    className="glass-card" 
    style={{ 
      padding: '24px', 
      flex: 1, 
      minWidth: '240px', 
      position: 'relative',
      cursor: 'pointer',
      border: isActive ? `2px solid ${color}` : '1px solid var(--glass-border)',
      background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--glass-bg)',
      transition: 'var(--transition)',
      boxShadow: isActive ? `0 0 25px ${color}40` : 'var(--shadow-2xl)'
    }}
  >
    {isLoading && (
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', zIndex: 1 }}>
        <Loader2 className="animate-spin" size={20} color="var(--primary)" />
      </div>
    )}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div style={{ 
        padding: '12px', 
        borderRadius: '12px', 
        background: isActive ? color : `${color}15`, 
        color: isActive ? 'white' : color,
        transition: 'var(--transition)'
      }}>
        <Icon size={24} />
      </div>
      {trend !== undefined && (
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
    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
      <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>{value}</span>
      <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>{unit}</span>
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
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [selectedParam, setSelectedParam] = useState(null); // 'humidity' | 'temp' | 'wind' | 'precip'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoadingWeather(true);
        const { lat, lon } = await weatherService.getLocation();
        const data = await weatherService.getWeatherData(lat, lon);
        setWeather(data);
      } catch (err) {
        setWeatherError('Failed to load weather data');
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, []);

  const getForecastData = () => {
    if (!weather || !selectedParam) return null;
    const days = weather.daily.time.map(t => new Date(t).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }));
    
    switch (selectedParam) {
      case 'temp':
        return { 
          title: 'Temperature Forecast', 
          color: '#f59e0b', 
          unit: '°C',
          values: weather.daily.temperature_2m_max,
          labels: days
        };
      case 'wind':
        return { 
          title: 'Wind Speed Forecast', 
          color: '#6366f1', 
          unit: 'km/h',
          values: weather.daily.wind_speed_10m_max,
          labels: days
        };
      case 'precip':
        return { 
          title: 'Precipitation Forecast', 
          color: '#0077b6', 
          unit: 'mm',
          values: weather.daily.precipitation_sum,
          labels: days
        };
      case 'humidity':
        // Compute daily average humidity from hourly data (24 entries per day)
        const humidityForecast = [];
        for (let i = 0; i < 7; i++) {
          const daySlice = weather.hourly.relative_humidity_2m.slice(i * 24, (i + 1) * 24);
          const avg = daySlice.reduce((a, b) => a + b, 0) / 24;
          humidityForecast.push(Math.round(avg));
        }
        return { 
          title: 'Humidity Forecast', 
          color: '#06b6d4', 
          unit: '%',
          values: humidityForecast,
          labels: days
        };
      default: return null;
    }
  };

  const forecast = getForecastData();
  const chartData = forecast ? forecast.values.map((val, idx) => ({
    name: forecast.labels[idx],
    value: val,
    isToday: idx === 0
  })) : [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <main style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'var(--transition)',
        minHeight: '100vh',
        width: '100%'
      }}>
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        
        <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
          <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '10px' }}>
                Field Dashboard
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>
                Real-time monitoring and smart insights for your sustainable farm.
              </p>
            </div>
            {weatherError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.9rem', marginBottom: '10px' }}>
                <AlertCircle size={16} /> {weatherError}
              </div>
            )}
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <StatCard 
              icon={Droplets} 
              label="Relative Humidity" 
              value={weather?.current?.relative_humidity_2m || '--'} 
              unit="%" 
              color="#06b6d4" 
              isLoading={loadingWeather} 
              isActive={selectedParam === 'humidity'}
              onClick={() => setSelectedParam(selectedParam === 'humidity' ? null : 'humidity')}
            />
            <StatCard 
              icon={Thermometer} 
              label="Temperature" 
              value={weather?.current?.temperature_2m || '--'} 
              unit="°C" 
              color="#f59e0b" 
              isLoading={loadingWeather} 
              isActive={selectedParam === 'temp'}
              onClick={() => setSelectedParam(selectedParam === 'temp' ? null : 'temp')}
            />
            <StatCard 
              icon={Wind} 
              label="Wind Speed" 
              value={weather?.current?.wind_speed_10m || '--'} 
              unit="km/h" 
              color="#6366f1" 
              isLoading={loadingWeather} 
              isActive={selectedParam === 'wind'}
              onClick={() => setSelectedParam(selectedParam === 'wind' ? null : 'wind')}
            />
            <StatCard 
              icon={CloudRain} 
              label="Precipitation (7d)" 
              value={weather?.daily?.precipitation_sum?.reduce((a, b) => a + b, 0).toFixed(1) || '--'} 
              unit="mm" 
              color="var(--primary)" 
              isLoading={loadingWeather} 
              isActive={selectedParam === 'precip'}
              onClick={() => setSelectedParam(selectedParam === 'precip' ? null : 'precip')}
            />
          </div>

          <AnimatePresence mode="wait">
            {forecast && (
              <motion.div
                key={selectedParam}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-card"
                style={{ padding: '32px', marginBottom: '48px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(16px)' }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    7-Day Forecast Analysis
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>{forecast.title}</h3>
                </div>
                
                <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {selectedParam === 'precip' ? (
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                        />
                        <Tooltip content={<CustomTooltip unit={forecast.unit} />} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isToday ? forecast.color : `${forecast.color}80`} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                        />
                        <Tooltip content={<CustomTooltip unit={forecast.unit} />} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={forecast.color} 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: 'white', strokeWidth: 2, stroke: forecast.color }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
