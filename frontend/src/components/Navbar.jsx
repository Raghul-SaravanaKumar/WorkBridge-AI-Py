import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, User, LayoutDashboard, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <nav style={styles.nav} className="glass-panel">
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <Briefcase size={28} color="#6366f1" />
          <span>Work<span style={{ color: '#14b8a6' }}>Bridge</span></span>
        </Link>

        <div style={styles.links}>
          {token ? (
            <>
              <Link to="/dashboard" style={styles.link}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              {role === 'CUSTOMER' && (
                <Link to="/post-job" style={styles.link}>
                  <PlusCircle size={18} />
                  <span>Post a Job</span>
                </Link>
              )}

              {role === 'WORKER' && (
                <Link to="/worker" style={styles.link}>
                  <User size={18} />
                  <span>My Profile</span>
                </Link>
              )}

            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginLink}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: '16px 24px',
    borderRadius: '0',
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.4rem',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--color-text-secondary)',
    transition: 'color 0.2s',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderLeft: '1px solid var(--border-color)',
    paddingLeft: '16px',
  },
  userEmail: {
    fontSize: '0.85rem',
    color: 'var(--color-text-muted)',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-accent)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  loginLink: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
  }
};

export default Navbar;
