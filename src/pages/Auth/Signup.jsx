import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Eye, EyeOff, Loader2, UserPlus, MapPin, Layers, Droplets } from 'lucide-react';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    village: '',
    farmSize: '',
    irrigationType: 'Drip',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const handleLocateMe = async () => {
    if (!navigator.geolocation) {
      return toast.error('Geolocation is not supported by your browser');
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
          );
          const data = await response.json();
          
          const areaName = data.address.city || 
                           data.address.town || 
                           data.address.village || 
                           data.address.suburb || 
                           data.address.district || 
                           'Unknown Area';
          
          setFormData(prev => ({ ...prev, village: areaName }));
          toast.success(`Located: ${areaName}`);
        } catch (error) {
          toast.error('Failed to resolve location name');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        toast.error('Location access denied');
        setLocating(false);
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await authService.register(
        formData.email, 
        formData.password, 
        formData.fullName, 
        formData.phone,
        formData.village,
        formData.farmSize,
        formData.irrigationType
      );
      toast.success('Registration successful! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.loginWithGoogle();
      toast.success('Signed up with Google!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card" 
      >
        {/* Fixed Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '2px', fontWeight: '700', color: 'var(--text-main)' }}>Create Account</h1>
          <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Join the JalSanchaee community today</p>
        </div>

        {/* Scrollable Form Area */}
        <div className="auth-scroll-area">
          <form onSubmit={handleSubmit} className="auth-form" id="signup-form">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={17} />
                <input
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="auth-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={17} />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="auth-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={17} />
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="auth-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Village / Location</label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={17} />
                <input
                  name="village"
                  type="text"
                  required
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="Village Name"
                  className="auth-input glass-input"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={handleLocateMe}
                  disabled={locating}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    borderRadius: '8px',
                    zIndex: 10
                  }}
                  title="Auto-fetch current location"
                >
                  {locating ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                </button>
              </div>
            </div>

            <div className="responsive-grid">
              <div className="input-group">
                <label className="input-label">Farm Size (Acres)</label>
                <div className="input-wrapper">
                  <Layers className="input-icon" size={17} />
                  <input
                    name="farmSize"
                    type="number"
                    step="0.1"
                    required
                    value={formData.farmSize}
                    onChange={handleChange}
                    placeholder="e.g. 5.5"
                    className="auth-input"
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Irrigation Type</label>
                <div className="input-wrapper">
                  <Droplets className="input-icon" size={17} />
                  <select
                    name="irrigationType"
                    required
                    value={formData.irrigationType}
                    onChange={handleChange}
                    className="auth-input"
                    style={{ appearance: 'none' }}
                  >
                    <option value="Drip">Drip</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Flood">Flood</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="responsive-grid">
              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={17} />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="auth-input glass-input"
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Confirm</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={17} />
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="auth-input glass-input"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '4px' }} onClick={() => setShowPassword(!showPassword)}>
              <input type="checkbox" checked={showPassword} onChange={() => {}} style={{ cursor: 'pointer' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Show Passwords</span>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div style={{ marginTop: 'auto' }}>
          <button
            form="signup-form"
            type="submit"
            disabled={loading}
            className="submit-btn"
            style={{ width: '100%', marginTop: '0' }}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Create Account <UserPlus size={17} /></>}
          </button>

          <div className="divider" style={{ margin: '16px 0' }}>
            <div className="divider-line"></div>
            <span className="divider-text">OR</span>
            <div className="divider-line"></div>
          </div>

          <button onClick={handleGoogleLogin} className="google-btn">
            <img src="/google.svg" alt="G" className="google-icon" />
            <span>Continue with Google</span>
          </button>

          <p className="auth-footer" style={{ marginTop: '16px' }}>
            Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
