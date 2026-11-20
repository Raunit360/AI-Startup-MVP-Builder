import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }) => {
  if (!children) return null;

  // Determine badge styling based on variant or content
  const getBadgeClass = () => {
    const key = String(variant || children).toLowerCase().trim();

    if (key === 'high' || key === 'urgent' || key === 'critical') return 'badge-high';
    if (key === 'medium' || key === 'moderate') return 'badge-medium';
    if (key === 'low' || key === 'minor') return 'badge-low';
    if (key === 'completed' || key === 'success' || key === 'active') return 'badge-completed';
    if (key === 'analyzing' || key === 'generating' || key === 'in-progress') return 'badge-analyzing';
    if (key === 'draft') return 'badge-draft';
    if (key === 'info') return 'badge-info';
    if (key === 'warning') return 'badge-warning';

    // Industry variants
    const industryPalette = {
      technology: { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
      healthcare: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
      education: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
      finance: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
      'e-commerce': { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
      entertainment: { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' },
      'food & beverage': { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
      travel: { bg: '#f0fdfa', text: '#115e59', border: '#99f6e4' },
      'real estate': { bg: '#f8fafc', text: '#334155', border: '#cbd5e1' },
      other: { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' },
    };

    if (industryPalette[key]) {
      return 'badge-custom-industry';
    }

    return 'badge-neutral';
  };

  const badgeClass = getBadgeClass();
  const sizeClass = size === 'sm' ? 'badge-sm' : '';

  // Custom inline style for industries if matching
  const key = String(variant || children).toLowerCase().trim();
  const industryColors = {
    technology: { backgroundColor: '#eef2ff', color: '#4338ca', borderColor: '#c7d2fe' },
    healthcare: { backgroundColor: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' },
    education: { backgroundColor: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' },
    finance: { backgroundColor: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' },
    'e-commerce': { backgroundColor: '#fdf2f8', color: '#9d174d', borderColor: '#fbcfe8' },
    entertainment: { backgroundColor: '#faf5ff', color: '#6b21a8', borderColor: '#e9d5ff' },
    'food & beverage': { backgroundColor: '#fff7ed', color: '#9a3412', borderColor: '#fed7aa' },
    travel: { backgroundColor: '#f0fdfa', color: '#115e59', borderColor: '#99f6e4' },
    'real estate': { backgroundColor: '#f8fafc', color: '#334155', borderColor: '#cbd5e1' },
  };

  const customStyle = industryColors[key] || {};

  return (
    <span
      className={`badge ${badgeClass} ${sizeClass} ${className}`}
      style={customStyle}
    >
      {children}
    </span>
  );
};

export default Badge;
