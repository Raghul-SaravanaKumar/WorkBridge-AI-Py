import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Star, MapPin, Award, DollarSign, ArrowLeft, Heart, Check } from 'lucide-react';

const Recommendation = () => {
  const { jobId } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Custom mock state to simulate hiring a worker in this demo
  const [hiredWorkerId, setHiredWorkerId] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, [jobId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch the job details for reference
      const jobResponse = await API.get('/jobs');
      const foundJob = jobResponse.data.find(j => j.id === jobId);
      if (foundJob) {
        setJob(foundJob);
      }

      // Fetch recommended workers
      const response = await API.get(`/recommend/${jobId}`);
      setRecommendations(response.data);
    } catch (err) {
      setError('Could not calculate matches.');
    } finally {
      setLoading(false);
    }
  };

  const handleHire = async (workerName, workerEmail) => {
    try {
      await API.post(`/jobs/${jobId}/hire`, { workerName, workerEmail });
      setHiredWorkerId(workerName);
      alert(`Successfully hired ${workerName}!`);
    } catch (err) {
      alert('Failed to hire worker. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Running matching algorithm...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.backBtn}>
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>
        {job && (
          <div style={styles.jobRefCard} className="glass-panel">
            <span style={styles.jobRefTag}>Matching For:</span>
            <h1 style={styles.jobRefTitle}>{job.title}</h1>
            <div style={styles.jobRefMeta}>
              <span><strong>Skill:</strong> {job.requiredSkill}</span>
              <span><strong>Location:</strong> {job.location}</span>
              <span><strong>Budget:</strong> ₹{job.budget}</span>
            </div>
          </div>
        )}
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      <h2 style={styles.sectionHeader}>⭐ Smart Match Engine Recommendations</h2>

      {recommendations.length === 0 ? (
        <div style={styles.emptyState} className="glass-panel">
          <Award size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
          <h3>No registered workers found</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            There are currently no workers registered in the match engine database. Register a worker profile to see suggestions.
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {recommendations.map((rec, index) => {
            const scoreColor = rec.score >= 80 ? '#14b8a6' : rec.score >= 50 ? '#6366f1' : '#f43f5e';
            const isHired = hiredWorkerId === rec.name;

            return (
              <div key={rec.id || rec.name} style={styles.recCard} className="glass-panel">
                {/* Ranking Ribbon */}
                {index === 0 && (
                  <div style={styles.bestMatchTag}>Best Match</div>
                )}

                <div style={styles.cardLayout}>
                  {/* Left Column: Name & details */}
                  <div style={styles.detailsCol}>
                    <h3 style={styles.workerName}>{rec.name}</h3>
                    <p style={styles.workerSkill}>{rec.skill}</p>

                    <div style={styles.statsRow}>
                      <div style={styles.statItem}>
                        <Award size={16} color="var(--color-primary)" />
                        <span>{rec.experience} Years Experience</span>
                      </div>
                      <div style={styles.statItem}>
                        <MapPin size={16} color="var(--color-secondary)" />
                        <span>{rec.location}</span>
                      </div>
                      <div style={styles.statItem}>
                        <DollarSign size={16} color="#eab308" />
                        <span>Expected: ₹{rec.expectedSalary}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Match Score Meter */}
                  <div style={styles.scoreCol}>
                    <div style={styles.scoreWrapper}>
                      <div style={{ ...styles.scoreGauge, borderColor: scoreColor }}>
                        <span style={styles.scoreNumber}>{rec.score}%</span>
                        <span style={styles.scoreText}>Match</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleHire(rec.name, rec.email)} 
                      style={{
                        ...styles.hireBtn,
                        ...(isHired ? styles.hiredBtn : {})
                      }}
                      className={!isHired ? "btn-primary" : ""}
                      disabled={isHired}
                    >
                      {isHired ? (
                        <>
                          <Check size={16} />
                          <span>Hired!</span>
                        </>
                      ) : (
                        <>
                          <Heart size={16} />
                          <span>Hire Worker</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '850px',
    margin: '0 auto',
    padding: '40px 24px',
    width: '100%',
  },
  header: {
    marginBottom: '32px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '20px',
  },
  jobRefCard: {
    padding: '24px',
    borderRadius: 'var(--radius-md)',
  },
  jobRefTag: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: 'var(--color-primary)',
    fontWeight: '800',
    letterSpacing: '0.05em',
  },
  jobRefTitle: {
    fontSize: '1.5rem',
    margin: '4px 0 12px',
  },
  jobRefMeta: {
    display: 'flex',
    gap: '24px',
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
    flexWrap: 'wrap',
  },
  sectionHeader: {
    fontSize: '1.3rem',
    marginBottom: '24px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  recCard: {
    padding: '28px',
    position: 'relative',
    overflow: 'hidden',
  },
  bestMatchTag: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    color: '#000',
    fontWeight: '800',
    fontSize: '0.75rem',
    padding: '4px 12px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    boxShadow: '0 4px 10px rgba(234, 179, 8, 0.3)',
  },
  cardLayout: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  detailsCol: {
    flex: 1,
    minWidth: '280px',
  },
  workerName: {
    fontSize: '1.4rem',
    marginBottom: '4px',
  },
  workerSkill: {
    color: 'var(--color-secondary)',
    fontWeight: '600',
    fontSize: '0.95rem',
    marginBottom: '16px',
  },
  statsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
  },
  scoreCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    width: '140px',
  },
  scoreWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreGauge: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    border: '4px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
  },
  scoreNumber: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.2',
  },
  scoreText: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
    fontWeight: '600',
  },
  hireBtn: {
    width: '100%',
    padding: '10px 16px',
    fontSize: '0.85rem',
  },
  hiredBtn: {
    background: 'rgba(20, 184, 166, 0.2)',
    color: 'var(--color-secondary)',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '4px',
    padding: '10px 16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    cursor: 'not-allowed',
    width: '100%',
  },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
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

export default Recommendation;
