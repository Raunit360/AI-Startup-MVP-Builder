
import React from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';

import './RiskCard.css';

const RiskCard = ({ risk, index = 0 }) => {
  if (!risk) return null;

  const {
    risk: riskDescription = 'Potential project risk',
    mitigation = 'Review this risk and prepare an appropriate mitigation strategy.',
    severity = 'Medium',
  } = risk;

  const severityValue = String(severity).toLowerCase();

  const severityClass = ['high', 'medium', 'low'].includes(severityValue)
    ? severityValue
    : 'medium';

  const severityConfig = {
    high: {
      label: 'High Severity',
      color: '#dc2626',
      background: '#fef2f2',
      border: '#fecaca',
      icon: ShieldAlert,
    },
    medium: {
      label: 'Medium Severity',
      color: '#d97706',
      background: '#fffbeb',
      border: '#fde68a',
      icon: AlertTriangle,
    },
    low: {
      label: 'Low Severity',
      color: '#059669',
      background: '#ecfdf5',
      border: '#a7f3d0',
      icon: ShieldCheck,
    },
  };

  const config = severityConfig[severityClass];
  const SeverityIcon = config.icon;

  return (
    <article className={`risk-card risk-${severityClass}`}>

      {/* Risk Header */}
      <div className="risk-card-header">

        <div className="risk-heading">

          <div
            className="risk-icon"
            style={{
              color: config.color,
              backgroundColor: config.background,
            }}
          >
            <AlertTriangle size={19} />
          </div>

          <div className="risk-title-content">
            <span className="risk-label">
              POTENTIAL RISK #{index + 1}
            </span>

            <h3 className="risk-description">
              {riskDescription}
            </h3>
          </div>

        </div>

        <span
          className="risk-severity-badge"
          style={{
            color: config.color,
            backgroundColor: config.background,
            borderColor: config.border,
          }}
        >
          <SeverityIcon size={13} />
          {config.label}
        </span>

      </div>

      {/* Severity Indicator */}
      <div className="risk-severity-track">
        <div
          className={`risk-severity-fill ${severityClass}`}
        />
      </div>

      {/* Mitigation Strategy */}
      <div className="risk-mitigation-box">

        <div className="risk-mitigation-header">

          <div className="risk-mitigation-icon">
            <ShieldCheck size={18} />
          </div>

          <div>
            <h4>Recommended Mitigation Strategy</h4>
            <span>Suggested action to reduce project risk</span>
          </div>

          <ArrowUpRight
            size={17}
            className="risk-mitigation-arrow"
          />

        </div>

        <p className="risk-mitigation-text">
          {mitigation}
        </p>

      </div>

    </article>
  );
};

export default RiskCard;
