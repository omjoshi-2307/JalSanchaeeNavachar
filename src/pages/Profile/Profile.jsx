import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Layers, 
  Droplets, 
  Save, 
  Loader2, 
  Calendar,
  Shield
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    village: '',
    farmSize: '',
    irrigationType: 'Drip'
  });

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
          
          setProfileData(prev => ({ ...prev, village: areaName }));
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const data = await authService.getUserProfile(user.uid);
        if (data) {
          setProfileData({
            fullName: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            village: data.village || '',
            farmSize: data.farmSize || '',
            irrigationType: data.irrigationType || 'Drip',
            role: data.role || 'user',
            createdAt: data.createdAt
          });
        }
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateUserProfile(user.uid, {
        fullName: profileData.fullName,
        phone: profileData.phone,
        village: profileData.village,
        farmSize: profileData.farmSize,
        irrigationType: profileData.irrigationType
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

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
        
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '10px' }}>
              My Profile
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>
              Manage your personal information and farm configuration.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            <div 
              className="glass-card"
              style={{ 
                padding: '40px', 
                borderRadius: '24px',
                marginBottom: '32px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--glass-border)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: '88px', height: '88px', borderRadius: '28px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', shadow: '0 10px 15px -3px rgba(0, 119, 182, 0.4)' }}>
                  <User size={44} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>{profileData.fullName}</h2>
                  <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={16} /> {profileData.role === 'user' ? 'Member' : 'Administrator'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> Joined {profileData.createdAt ? new Date(profileData.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Full Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={18} />
                    <input 
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleChange}
                      className="auth-input glass-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input 
                      value={profileData.email}
                      disabled
                      className="auth-input"
                      style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Phone Number</label>
                  <div className="input-wrapper">
                    <Phone className="input-icon" size={18} />
                    <input 
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="auth-input glass-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Village / Location</label>
                  <div className="input-wrapper">
                    <MapPin className="input-icon" size={18} />
                    <input 
                      name="village"
                      value={profileData.village}
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
                        zIndex: 10
                      }}
                      title="Auto-fetch current location"
                    >
                      {locating ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Farm Size (Acres)</label>
                  <div className="input-wrapper">
                    <Layers className="input-icon" size={18} />
                    <input 
                      name="farmSize"
                      type="number"
                      step="0.1"
                      value={profileData.farmSize}
                      onChange={handleChange}
                      className="auth-input glass-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>Irrigation Type</label>
                  <div className="input-wrapper">
                    <Droplets className="input-icon" size={18} />
                    <select 
                      name="irrigationType"
                      value={profileData.irrigationType}
                      onChange={handleChange}
                      className="auth-input glass-input"
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

              <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="submit"
                  disabled={saving}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '14px 40px', 
                    borderRadius: '14px', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    fontWeight: '800', 
                    border: 'none', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 14px 0 rgba(0, 119, 182, 0.39)',
                    fontSize: '1rem'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 119, 182, 0.45)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 119, 182, 0.39)';
                  }}
                >
                  {saving ? <Loader2 className="animate-spin" size={22} /> : <><Save size={20} /> Save Changes</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
