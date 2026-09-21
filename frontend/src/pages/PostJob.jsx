import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { PlusCircle, Briefcase, DollarSign, MapPin, AlignLeft, CheckCircle } from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [requiredSkill, setRequiredSkill] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const payload = {
      title,
      requiredSkill,
      budget: Number(budget),
      location,
      description
    };

    try {
      await API.post('/jobs', payload);
      setSuccess('Job posted successfully! Launching matching engine...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.card} className="glass-panel">
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <PlusCircle size={24} color="#6366f1" />
          </div>
          <h2>Post a Job Requirement</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Specify the task specifications to find the best skilled workers.
          </p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}><CheckCircle size={16} /><span>{success}</span></div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title / Summary</label>
            <div style={styles.inputWrapper}>
              <Briefcase style={styles.inputIcon} size={18} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Repair Living Room Outlets" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
                style={styles.input}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skill / Specialty</label>
            <div style={styles.inputWrapper}>
              <Briefcase style={styles.inputIcon} size={18} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Electrician, Plumber, Painter" 
                value={requiredSkill}
                onChange={(e) => setRequiredSkill(e.target.value)}
                required 
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Maximum Budget (₹)</label>
              <div style={styles.inputWrapper}>
                <DollarSign style={styles.inputIcon} size={18} />
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Max fee" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required 
                  min="0"
                  style={styles.input}
                />
              </div>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Job Location (City)</label>
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
          </div>

          <div className="form-group">
            <label className="form-label">Job Description</label>
            <div style={styles.textareaWrapper}>
              <AlignLeft style={styles.textareaIcon} size={18} />
              <textarea 
                className="form-control" 
                placeholder="Describe details of the task, urgency, expected duration, etc." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
                rows="4"
                style={styles.textarea}
              />
            </div>
          </div>

          <div style={styles.btnGroup}>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Job'}
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
    maxWidth: '520px',
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
  textareaWrapper: {
    position: 'relative',
  },
  textareaIcon: {
    position: 'absolute',
    left: '16px',
    top: '14px',
    color: 'var(--color-text-muted)',
  },
  textarea: {
    paddingLeft: '48px',
    resize: 'none',
  },
  row: {
    display: 'flex',
    gap: '16px',
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
  }
};

export default PostJob;
