import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { UserPlus, Mail, Key, User, Briefcase, Award, MapPin, DollarSign } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' or 'WORKER'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [skill, setSkill] = useState('');
  const [experience, setExperience] = useState(1);
  const [location, setLocation] = useState('');
  const [expectedSalary, setExpectedSalary] = useState(500);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = {
      email,
      password,
      role,
      name,
      ...(role === 'WORKER' && {
        skill,
        experience: Number(experience),
        location,
        expectedSalary: Number(expectedSalary)
      })
    };

    try {
      const response = await API.post('/auth/register', payload);
      if (response.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.formCard} className="glass-panel">
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <UserPlus size={24} color="#6366f1" />
          </div>
          <h2>Create Account</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Join WorkBridge to match with job offers and workers</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}>{success}</div>}

        {/* Role Toggle Selector */}
        <div style={styles.roleToggleGroup}>
          <button 
            type="button" 
            style={{ 
              ...styles.roleToggleBtn, 
              ...(role === 'CUSTOMER' ? styles.activeToggle : {}) 
            }}
            onClick={() => setRole('CUSTOMER')}
          >
            Customer
          </button>
          <button 
            type="button" 
            style={{ 
              ...styles.roleToggleBtn, 
              ...(role === 'WORKER' ? styles.activeToggle : {}) 
            }}
            onClick={() => setRole('WORKER')}
          >
            Worker / Contractor
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={styles.inputWrapper}>
              <User style={styles.inputIcon} size={18} />
              <input 
                type="text" 
                className="form-control" 
                placeholder={role === 'CUSTOMER' ? "John Doe" : "Kumar S"} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                style={styles.input}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail style={styles.inputIcon} size={18} />
              <input 
                type="email" 
                className="form-control" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                style={styles.input}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={styles.inputWrapper}>
              <Key style={styles.inputIcon} size={18} />
              <input 
                type="password" 
                className="form-control" 
                placeholder="Minimum 6 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                style={styles.input}
              />
            </div>
          </div>

          {role === 'WORKER' && (
            <>
              <div style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Skill / Profession</label>
                  <div style={styles.inputWrapper}>
                    <Briefcase style={styles.inputIcon} size={18} />
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Electrician" 
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                      required 
                      style={styles.input}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ width: '120px' }}>
                  <label className="form-label">Experience</label>
                  <div style={styles.inputWrapper}>
                    <Award style={styles.inputIcon} size={18} />
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Yrs" 
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required 
                      min="0"
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Location (City)</label>
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

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Expected Salary (₹)</label>
                  <div style={styles.inputWrapper}>
                    <DollarSign style={styles.inputIcon} size={18} />
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="Daily Wage" 
                      value={expectedSalary}
                      onChange={(e) => setExpectedSalary(e.target.value)}
                      required 
                      min="0"
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={styles.footerLink}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>Login here</Link>
        </p>
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
  formCard: {
    width: '100%',
    maxWidth: '540px',
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
  roleToggleGroup: {
    display: 'flex',
    background: 'rgba(15, 23, 42, 0.8)',
    padding: '4px',
    borderRadius: '8px',
    marginBottom: '28px',
    border: '1px solid var(--border-color)',
  },
  roleToggleBtn: {
    flex: 1,
    padding: '10px',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s',
    fontSize: '0.9rem',
  },
  activeToggle: {
    background: 'var(--color-primary)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
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
  row: {
    display: 'flex',
    gap: '16px',
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
    textAlign: 'center',
  },
  footerLink: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
  }
};

export default Register;
