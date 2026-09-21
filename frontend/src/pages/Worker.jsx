import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { User, Briefcase, Award, MapPin, DollarSign, CheckCircle } from 'lucide-react';

const Worker = () => {
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState('');
  const [name, setName] = useState('');
  const [skill, setSkill] = useState('');
  const [experience, setExperience] = useState(0);
  const [location, setLocation] = useState('');
  const [expectedSalary, setExpectedSalary] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await API.get('/workers/me');
      if (response.data) {
        const p = response.data;
        setProfileId(p.id);
        setName(p.name);
        setSkill(p.skill);
        setExperience(p.experience);
        setLocation(p.location);
        setExpectedSalary(p.expectedSalary);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // No profile created yet, which is fine
        setName(localStorage.getItem('email')?.split('@')[0] || 'Worker');
      } else {
        setError('Error loading profile records.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const payload = {
      name,
      email: localStorage.getItem('email'),
      skill,
      experience: Number(experience),
      location,
      expectedSalary: Number(expectedSalary)
    };

    try {
      if (profileId) {
        // Update Profile (PUT)
        await API.put(`/workers/${profileId}`, payload);
        setSuccess('Profile updated successfully!');
      } else {
        // Create Profile (POST)
        const res = await API.post('/workers', payload);
        setProfileId(res.data.id);
        setSuccess('Profile created successfully!');
      }
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Fetching profile records...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.card} className="glass-panel">
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <User size={24} color="#6366f1" />
          </div>
          <h2>Worker Profile Management</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            {profileId ? 'Update your active worker matching details' : 'Configure details for worker match discovery'}
          </p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}><CheckCircle size={16} /><span>{success}</span></div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={styles.inputWrapper}>
              <User style={styles.inputIcon} size={18} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                style={styles.input}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skill / Profession</label>
            <div style={styles.inputWrapper}>
              <Briefcase style={styles.inputIcon} size={18} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Electrician, Plumber, Painter" 
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                required 
                style={styles.input}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Experience (Years)</label>
            <div style={styles.inputWrapper}>
              <Award style={styles.inputIcon} size={18} />
              <input 
                type="number" 
                className="form-control" 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required 
                min="0"
                style={styles.input}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Service Location (City)</label>
            <div style={styles.inputWrapper}>
              <MapPin style={styles.inputIcon} size={18} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Erode" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required 
                style={styles.input}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Expected Salary (₹ / Day)</label>
            <div style={styles.inputWrapper}>
              <DollarSign style={styles.inputIcon} size={18} />
              <input 
                type="number" 
                className="form-control" 
                placeholder="Expected rate" 
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                required 
                min="0"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.btnGroup}>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
    minHeight: '80vh',
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    padding: '40px 32px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  iconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    color: 'var(--color-text-muted)',
  },
  input: {
    paddingLeft: '48px',
  },
  btnGroup: {
    display: 'flex',
    gap: '16px',
    marginTop: '28px',
  },
  errorAlert: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    border: '1px solid rgba(244, 63, 94, 0.2)',
    color: 'var(--color-accent)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '24px',
    textAlign: 'center',
  },
  successAlert: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    border: '1px solid rgba(20, 184, 166, 0.2)',
    color: 'var(--color-secondary)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255,255,255,0.05)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }
};

export default Worker;
