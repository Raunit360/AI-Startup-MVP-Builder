import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  loading = false,
  destructive = true,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={!loading ? onClose : undefined}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div style={styles.modalHeader}>
          <div style={styles.iconContainer}>
            <AlertTriangle
              size={22}
              style={{ color: destructive ? '#ef4444' : '#f59e0b' }}
            />
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            style={styles.closeBtn}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div style={styles.modalBody}>
          <h3 id="modal-title" style={styles.title}>
            {title}
          </h3>
          <p style={styles.message}>{message}</p>
        </div>

        <div style={styles.modalFooter}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${destructive ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
            style={{ minWidth: '90px' }}
          >
            {loading ? (
              <div
                className="spinner spinner-sm"
                style={{ borderTopColor: '#ffffff' }}
              />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalHeader: {
    padding: '1.25rem 1.5rem 0.5rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: '#fef2f2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    color: '#9ca3af',
    padding: '4px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'color 150ms ease',
  },
  modalBody: {
    padding: '0.75rem 1.5rem 1.5rem 1.5rem',
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '0.5rem',
  },
  message: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: 1.5,
  },
  modalFooter: {
    padding: '1rem 1.5rem',
    backgroundColor: '#fafbfc',
    borderTop: '1px solid #f3f4f6',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
  },
};

export default ConfirmModal;
