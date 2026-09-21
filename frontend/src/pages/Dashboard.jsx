import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Plus, Trash2, ArrowRight, Briefcase, MapPin, Award, DollarSign, FileText, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');
  
  const [myJobs, setMyJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    navigate('/login');
  };

  useEffect(() => {
    fetchDashboardData();
  }, [role]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      if (role === 'CUSTOMER') {
        const response = await API.get('/jobs/my');
        setMyJobs(response.data);
      } else if (role === 'WORKER') {
        // Fetch worker profile details
        try {
          const profileResponse = await API.get('/workers/me');
          setMyProfile(profileResponse.data);
        } catch (e) {
          // Worker profile not found yet or error
        }
        // Fetch all jobs available
        const jobsResponse = await API.get('/jobs');
        setAllJobs(jobsResponse.data);
      }
    } catch (err) {
      setError('Could not fetch dashboard records.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      setMyJobs(myJobs.filter(job => job.id !== id));
    } catch (err) {
      alert('Failed to delete job.');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading dashboard records...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.welcomeBanner}>
        <div>
          <h1 style={styles.welcomeTitle}>Dashboard</h1>
          <p style={styles.welcomeSub}>Signed in as: <strong style={{ color: 'var(--color-primary)' }}>{email}</strong> ({role})</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {role === 'CUSTOMER' && (
            <Link to="/post-job" className="btn-primary">
              <Plus size={18} />
              <span>Post New Job</span>
            </Link>
          )}
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '10px 16px' }}>
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      {/* CUSTOMER DASHBOARD */}
      {role === 'CUSTOMER' && (
        <section style={styles.section}>
          <h2 style={styles.sectionHeader}>My Posted Jobs</h2>
          {myJobs.length === 0 ? (
            <div style={styles.emptyState} className="glass-panel">
              <FileText size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
              <h3>No jobs posted yet</h3>
              <p style={{ color: 'var(--color-text-secondary)', margin: '8px 0 20px' }}>
                Post a job requirement to get instant AI-powered recommendations matching top skilled workers.
              </p>
              <Link to="/post-job" className="btn-primary">
                <Plus size={18} />
                <span>Post Your First Job</span>
              </Link>
            </div>
          ) : (
            <div style={styles.grid}>
              {myJobs.map((job) => (
                <div key={job.id} style={styles.jobCard} className="glass-panel">
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.jobTitle}>{job.title}</h3>
                      {job.status === 'HIRED' && (
                        <span style={{...styles.matchTag, backgroundColor: 'rgba(20, 184, 166, 0.15)', color: '#14b8a6', marginLeft: '0px', marginTop: '4px', display: 'inline-block'}}>
                          Hired: {job.hiredWorkerName}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDeleteJob(job.id)} 
                      style={styles.deleteBtn}
                      title="Delete Posting"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <p style={styles.jobDesc}>{job.description}</p>

                  <div style={styles.metaGrid}>
                    <div style={styles.metaItem}>
                      <Briefcase size={16} color="var(--color-primary)" />
                      <span>{job.requiredSkill}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <MapPin size={16} color="var(--color-secondary)" />
                      <span>{job.location}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <DollarSign size={16} color="#eab308" />
                      <span>Budget: ₹{job.budget}</span>
                    </div>
                  </div>

                  {job.status !== 'HIRED' && (
                    <button 
                      onClick={() => navigate(`/recommend/${job.id}`)} 
                      className="btn-primary" 
                      style={{ width: '100%', marginTop: '20px' }}
                    >
                      <span>View Matches</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* WORKER DASHBOARD */}
      {role === 'WORKER' && (
        <div style={styles.workerGrid}>
          {/* Left Column: Worker Profile summary */}
          <div style={{ flex: 1 }}>
            <h2 style={styles.sectionHeader}>My Profile Details</h2>
            {myProfile ? (
              <div style={styles.profileCard} className="glass-panel">
                <h3 style={styles.profileName}>{myProfile.name}</h3>
                <p style={styles.profileEmail}>{myProfile.email}</p>
                
                <div style={styles.divider}></div>

                <div style={styles.profileDetailsGrid}>
                  <div style={styles.profileDetailItem}>
                    <Briefcase size={18} color="var(--color-primary)" />
                    <div>
                      <label style={styles.detailLabel}>Skill</label>
                      <span style={styles.detailValue}>{myProfile.skill}</span>
                    </div>
                  </div>
                  <div style={styles.profileDetailItem}>
                    <Award size={18} color="var(--color-secondary)" />
                    <div>
                      <label style={styles.detailLabel}>Experience</label>
                      <span style={styles.detailValue}>{myProfile.experience} Years</span>
                    </div>
                  </div>
                  <div style={styles.profileDetailItem}>
                    <MapPin size={18} color="#f43f5e" />
                    <div>
                      <label style={styles.detailLabel}>Location</label>
                      <span style={styles.detailValue}>{myProfile.location}</span>
                    </div>
                  </div>
                  <div style={styles.profileDetailItem}>
                    <DollarSign size={18} color="#eab308" />
                    <div>
                      <label style={styles.detailLabel}>Expected Wage</label>
                      <span style={styles.detailValue}>₹{myProfile.expectedSalary} / day</span>
                    </div>
                  </div>
                </div>

                <Link to="/worker" className="btn-secondary" style={{ width: '100%', marginTop: '24px' }}>
                  Edit Profile Card
                </Link>
              </div>
            ) : (
              <div style={styles.profileCard} className="glass-panel">
                <h3>No Profile Formed</h3>
                <p style={{ color: 'var(--color-text-secondary)', margin: '10px 0 20px' }}>Fill in your worker details to match on customer listings.</p>
                <Link to="/worker" className="btn-primary" style={{ width: '100%' }}>Create Worker Profile</Link>
              </div>
            )}
          </div>

          {/* Right Column: Available Jobs */}
          <div style={{ flex: 2 }}>
            <h2 style={styles.sectionHeader}>Available Job Postings</h2>
            {allJobs.filter(j => j.status === 'HIRED' && myProfile && j.hiredWorkerEmail === myProfile.email).length > 0 && (
              <div style={{ backgroundColor: 'rgba(20, 184, 166, 0.15)', padding: '20px', borderRadius: '8px', border: '1px solid #14b8a6', marginBottom: '24px' }}>
                <h3 style={{ color: '#14b8a6', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={24} /> Congratulations!
                </h3>
                <p style={{ color: 'var(--color-text-primary)' }}>You have been hired for one or more jobs. Check the list below for details.</p>
              </div>
            )}

            {allJobs.length === 0 ? (
              <div style={styles.emptyState} className="glass-panel">
                <Briefcase size={40} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
                <h3>No jobs available at this moment</h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>Check back later for newly posted jobs.</p>
              </div>
            ) : (
              <div style={styles.verticalList}>
                {allJobs.map((job) => {
                  // highlight if match
                  const isSkillMatch = myProfile && myProfile.skill && job.requiredSkill.toLowerCase().includes(myProfile.skill.toLowerCase());
                  const isLocationMatch = myProfile && myProfile.location && job.location.toLowerCase() === myProfile.location.toLowerCase();
                  
                  return (
                    <div key={job.id} style={{
                      ...styles.availableJobCard,
                      ...(isSkillMatch ? styles.matchingJobBorder : {})
                    }} className="glass-panel">
                      <div style={styles.cardHeader}>
                        <div>
                          <h3 style={styles.jobTitle}>{job.title}</h3>
                          <span style={styles.posterEmail}>Posted by: {job.customerName || job.customerId}</span>
                        </div>
                        {job.status === 'HIRED' && job.hiredWorkerEmail === myProfile?.email && (
                           <span style={{...styles.matchTag, backgroundColor: 'rgba(20, 184, 166, 0.15)', color: '#14b8a6'}}>🎉 You were hired!</span>
                        )}
                        {job.status === 'HIRED' && job.hiredWorkerEmail !== myProfile?.email && (
                           <span style={{...styles.matchTag, backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text-muted)'}}>Position Filled</span>
                        )}
                        {job.status === 'OPEN' && isSkillMatch && (
                          <span style={styles.matchTag}>Skill Match</span>
                        )}
                      </div>
                      <p style={styles.jobDesc}>{job.description}</p>
                      
                      <div style={styles.metaRow}>
                        <div style={styles.metaItem}>
                          <Briefcase size={14} color="var(--color-primary)" />
                          <span>Required: {job.requiredSkill}</span>
                        </div>
                        <div style={styles.metaItem}>
                          <MapPin size={14} color="var(--color-secondary)" />
                          <span style={isLocationMatch ? { color: 'var(--color-secondary)', fontWeight: 'bold' } : {}}>{job.location}</span>
                        </div>
                        <div style={styles.metaItem}>
                          <DollarSign size={14} color="#eab308" />
                          <span>Budget: ₹{job.budget}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px',
    width: '100%',
  },
  welcomeBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '36px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  welcomeTitle: {
    fontSize: '2.2rem',
  },
  welcomeSub: {
    color: 'var(--color-text-secondary)',
    marginTop: '4px',
    fontSize: '0.95rem',
  },
  section: {
    marginBottom: '40px',
  },
  sectionHeader: {
    fontSize: '1.4rem',
    marginBottom: '20px',
    fontWeight: '600',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  jobCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '14px',
  },
  jobTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-accent)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background 0.2s',
  },
  jobDesc: {
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.5',
    marginBottom: '20px',
    flexGrow: 1,
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '16px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '12px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
  },
  emptyState: {
    padding: '60px 24px',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '40px auto',
  },
  workerGrid: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
  },
  profileCard: {
    padding: '24px',
  },
  profileName: {
    fontSize: '1.4rem',
  },
  profileEmail: {
    fontSize: '0.85rem',
    color: 'var(--color-text-muted)',
    marginTop: '2px',
  },
  divider: {
    height: '1px',
    background: 'var(--border-color)',
    margin: '20px 0',
  },
  profileDetailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  profileDetailItem: {
    display: 'flex',
    gap: '10px',
  },
  detailLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--color-text-primary)',
  },
  verticalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  availableJobCard: {
    padding: '20px 24px',
  },
  matchingJobBorder: {
    borderColor: 'var(--color-primary)',
    background: 'rgba(99, 102, 241, 0.05)',
  },
  posterEmail: {
    fontSize: '0.8rem',
    color: 'var(--color-text-muted)',
  },
  matchTag: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--color-primary)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  errorAlert: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    border: '1px solid rgba(244, 63, 94, 0.2)',
    color: 'var(--color-accent)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '24px',
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

export default Dashboard;
