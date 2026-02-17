import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        formData.phone
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card" 
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '40px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: '700' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join the JalSanchaee community today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
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
              <Mail className="input-icon" size={18} />
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
              <Phone className="input-icon" size={18} />
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="auth-input"
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Confirm</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="auth-input"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
            <input type="checkbox" checked={showPassword} onChange={() => {}} style={{ cursor: 'pointer' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Show Passwords</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <UserPlus size={18} /></>}
          </button>
        </form>

        <div className="divider" style={{ margin: '24px 0' }}>
          <div className="divider-line"></div>
          <span className="divider-text">OR</span>
          <div className="divider-line"></div>
        </div>

        <button onClick={handleGoogleLogin} className="google-btn">
          <img src="/google.svg" alt="G" className="google-icon" />
          <span>Continue with Google</span>
        </button>

        <p className="auth-footer" style={{ marginTop: '24px' }}>
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
