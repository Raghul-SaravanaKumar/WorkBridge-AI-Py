import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Star, MapPin } from 'lucide-react';

const Home = () => {
  const token = localStorage.getItem('token');

  return (
    <div style={styles.page} className="animate-fade-in">
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          Connecting Customers with <br />
          <span style={styles.gradientText}>Skilled Professionals</span>
        </h1>
        <p style={styles.subtitle}>
          WorkBridge is an intelligent match engine that evaluates skill, location, experience, and budget compatibility to find the perfect professional for your job.
        </p>
        <div style={styles.ctaGroup}>
          {token ? (
            <Link to="/dashboard" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>Get Started</Link>
              <Link to="/login" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem' }}>Sign In</Link>
            </>
          )}
        </div>
      </section>

      {/* Matching Factors */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>The Smart Match Engine</h2>
        <p style={styles.sectionSubtitle}>We use a deterministic weighted compatibility matrix to verify matching factors instantly.</p>
        
        <div style={styles.grid}>
          <div style={styles.card} className="glass-panel">
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
              <Zap color="#6366f1" size={24} />
            </div>
            <h3 style={styles.cardTitle}>Skill Matching (50%)</h3>
            <p style={styles.cardText}>Core evaluation ensuring the professional specializes in the exact services you require (e.g. Electrician, Plumber).</p>
          </div>

          <div style={styles.card} className="glass-panel">
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
              <MapPin color="#14b8a6" size={24} />
            </div>
            <h3 style={styles.cardTitle}>Location Proximity (25%)</h3>
            <p style={styles.cardText}>Prioritizes professionals operating in your city or neighborhood to minimize transport wait times.</p>
          </div>

          <div style={styles.card} className="glass-panel">
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(244, 63, 94, 0.1)' }}>
              <Star color="#f43f5e" size={24} />
            </div>
            <h3 style={styles.cardTitle}>Experience (15%)</h3>
            <p style={styles.cardText}>Favorable scaling for senior operators. Score scales linearly based on years of field experience.</p>
          </div>

          <div style={styles.card} className="glass-panel">
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(234, 179, 8, 0.1)' }}>
              <ShieldCheck color="#eab308" size={24} />
            </div>
            <h3 style={styles.cardTitle}>Budget Compatibility (10%)</h3>
            <p style={styles.cardText}>Evaluates expected wages against job budgets to identify economically compatible agreements.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 24px',
  },
  hero: {
    textAlign: 'center',
    padding: '40px 0 80px',
  },
  title: {
    fontSize: '3.5rem',
    lineHeight: '1.2',
    marginBottom: '20px',
  },
  gradientText: {
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.15rem',
    color: 'var(--color-text-secondary)',
    maxWidth: '650px',
    margin: '0 auto 36px',
    lineHeight: '1.6',
  },
  ctaGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
  },
  features: {
    padding: '40px 0',
  },
  sectionTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '10px',
  },
  sectionSubtitle: {
    textAlign: 'center',
    color: 'var(--color-text-secondary)',
    marginBottom: '48px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '30px',
    textAlign: 'left',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '1.2rem',
    marginBottom: '10px',
  },
  cardText: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  }
};

export default Home;
