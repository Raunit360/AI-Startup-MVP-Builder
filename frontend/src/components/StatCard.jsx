
import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
} from 'lucide-react';
import './StatCard.css';

export const StatCard = ({
  icon: Icon,
  value,
  label,
  trend,
  trendLabel = 'vs last month',
  color = '#6366f1',
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="stat-card stat-card-loading">
        <div className="stat-card-content">
          <div className="skeleton stat-skeleton-value" />
          <div className="skeleton stat-skeleton-label" />
          <div className="skeleton stat-skeleton-trend" />
        </div>
        <div className="skeleton stat-skeleton-icon" />
      </div>
    );
  }

  const hasTrend = trend !== undefined && trend !== null && trend !== '';

  const trendText =
    typeof trend === 'number'
      ? `${trend > 0 ? '+' : ''}${trend}%`
      : String(trend ?? '').replace(/%+$/, '') + '%';

  const isNeutral =
    trend === 0 ||
    trend === '0' ||
    trend === '0%' ||
    trend === 'neutral';

  const isPositive =
    typeof trend === 'number'
      ? trend > 0
      : String(trend).startsWith('+');

  const TrendIcon = isNeutral
    ? Minus
    : isPositive
      ? TrendingUp
      : TrendingDown;

  const trendClass = isNeutral
    ? 'neutral'
    : isPositive
      ? 'positive'
      : 'negative';

  return (
    <div
      className="stat-card"
      style={{ '--stat-color': color }}
    >
      <div className="stat-card-top">
        <div className="stat-card-content">
          <span className="stat-label">{label}</span>
          <h2 className="stat-value">{value ?? '—'}</h2>
        </div>

        {Icon && (
          <div className="stat-icon-wrapper">
            <Icon size={23} strokeWidth={2} />
          </div>
        )}
      </div>

      <div className="stat-card-bottom">
        {hasTrend ? (
          <div className={`stat-trend ${trendClass}`}>
            <TrendIcon size={15} strokeWidth={2.5} />
            <span className="stat-trend-value">{trendText}</span>
            {trendLabel && (
              <span className="stat-trend-label">{trendLabel}</span>
            )}
          </div>
        ) : (
          <span className="stat-no-trend">Project overview</span>
        )}

        <div className="stat-card-arrow">
          <ArrowUpRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
