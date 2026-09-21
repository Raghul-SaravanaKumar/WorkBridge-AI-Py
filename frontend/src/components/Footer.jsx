import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>&copy; {new Date().getFullYear()} WorkBridge. Created for Summer Internship Project (23CSL71).</p>
        <p style={styles.subtext}>Intelligent Skilled Worker Smart Match Engine</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    padding: '32px 24px',
    background: 'rgba(7, 10, 20, 0.9)',
    borderTop: '1px solid var(--border-color)',
    marginTop: 'auto',
    textAlign: 'center',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  text: {
    fontSize: '0.9rem',
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
  },
  subtext: {
    fontSize: '0.8rem',
    color: 'var(--color-text-muted)',
  }
};

export default Footer;
