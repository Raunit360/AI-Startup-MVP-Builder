import React from 'react';
import { CheckCircle2, Clock, Zap } from 'lucide-react';
import Badge from './Badge';

export const FeatureCard = ({ feature, index }) => {
  if (!feature) return null;

  const {
    name,
    description,
    priority = 'High',
    estimatedTime,
  } = feature;

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.indexPill}>
            <span>{typeof index === 'number' ? `#${index + 1}` : <CheckCircle2 size={16} />}</span>
          </div>
          <h4 style={styles.name}>{name}</h4>
        </div>
        <Badge variant={priority}>{priority}</Badge>
      </div>

      <div style={styles.body}>
        <p style={styles.description}>{description}</p>
      </div>

      {estimatedTime && (
        <div style={styles.footer}>
          <div style={styles.timeTag}>
            <Clock size={13} style={{ color: '#6366f1' }} />
            <span>Est. {estimatedTime}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.25rem',
    height: '100%',
    transition: 'all 200ms ease',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    flex: 1,
  },
  indexPill: {
    width: '26px',
    height: '26px',
    borderRadius: '6px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  name: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#111827',
    lineHeight: 1.3,
  },
  body: {
    flex: 1,
  },
  description: {
    fontSize: '0.875rem',
    color: '#4b5563',
    lineHeight: 1.5,
  },
  footer: {
    marginTop: '1rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #f3f4f6',
    display: 'flex',
    alignItems: 'center',
  },
  timeTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#4f46e5',
    backgroundColor: '#eef2ff',
    padding: '0.25rem 0.625rem',
    borderRadius: '9999px',
  },
};

export default FeatureCard;
