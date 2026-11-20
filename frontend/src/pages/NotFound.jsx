import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export const NotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <Compass size={48} color="#6366f1" />
        </div>
        <div style={styles.errorCode}>404</div>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.description}>
          The MVP roadmap or page you are searching for does not exist, has been moved,
          or is temporarily unreachable.
        </p>
        <div style={styles.actions}>
          <Link
            to="/"
            className="btn btn-primary btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Home size={18} />
            <span>Return to Dashboard</span>
          </Link>
          <Link to="/projects" className="btn btn-secondary btn-lg">
            <span>Browse Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    padding: '3.5rem 2.5rem',
    textAlign: 'center',
    maxWidth: '520px',
    width: '100%',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#eef2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem auto',
  },
  errorCode: {
    fontSize: '3rem',
    fontWeight: 900,
    color: '#6366f1',
    lineHeight: 1,
    letterSpacing: '-0.03em',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#111827',
    marginBottom: '0.75rem',
  },
  description: {
    fontSize: '0.9375rem',
    color: '#6b7280',
    lineHeight: 1.6,
    marginBottom: '2rem',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
};

export default NotFound;
