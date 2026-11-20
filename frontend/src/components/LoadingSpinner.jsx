import React from 'react';

export const LoadingSpinner = ({
  size = 'md',
  message = '',
  fullScreen = false,
  color = '#6366f1',
}) => {
  const spinnerElement = (
    <div style={styles.container}>
      <div
        className={`spinner spinner-${size}`}
        style={{
          borderTopColor: color,
        }}
      />
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div style={styles.fullScreenWrapper}>{spinnerElement}</div>;
  }

  return spinnerElement;
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.875rem',
    padding: '2rem 1rem',
  },
  message: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: 500,
    textAlign: 'center',
    maxWidth: '300px',
  },
  fullScreenWrapper: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
};

export default LoadingSpinner;
