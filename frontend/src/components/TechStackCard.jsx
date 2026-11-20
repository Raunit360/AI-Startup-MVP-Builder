
import React from 'react';
import {
  Monitor,
  Server,
  Database,
  Sparkles,
  Layers,
  ArrowUpRight,
  Code2,
} from 'lucide-react';

import './TechStackCard.css';

const TechStackCard = ({ technologyStack }) => {
  if (
    !technologyStack ||
    typeof technologyStack !== 'object' ||
    Array.isArray(technologyStack)
  ) {
    return null;
  }

  const {
    frontend = '',
    backend = '',
    database = '',
    aiTools = '',
    other = '',
  } = technologyStack;

  const stackCategories = [
    {
      id: 'frontend',
      label: 'Frontend Framework',
      description: 'User interface and experience',
      value: frontend,
      icon: Monitor,
      color: '#2563eb',
      background: '#eff6ff',
    },
    {
      id: 'backend',
      label: 'Backend & APIs',
      description: 'Server-side logic and APIs',
      value: backend,
      icon: Server,
      color: '#059669',
      background: '#ecfdf5',
    },
    {
      id: 'database',
      label: 'Database & Storage',
      description: 'Data management and storage',
      value: database,
      icon: Database,
      color: '#d97706',
      background: '#fffbeb',
    },
    {
      id: 'ai',
      label: 'AI & Machine Learning',
      description: 'Intelligent features and automation',
      value: aiTools,
      icon: Sparkles,
      color: '#7c3aed',
      background: '#f5f3ff',
    },
    {
      id: 'infrastructure',
      label: 'DevOps & Infrastructure',
      description: 'Deployment and supporting tools',
      value: other,
      icon: Layers,
      color: '#475569',
      background: '#f1f5f9',
    },
  ];

  const getTags = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => String(item).trim())
        .filter(Boolean);
    }

    if (typeof value === 'string') {
      return value
        .split(/[,+]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return value ? [String(value)] : [];
  };

  return (
    <div className="tech-stack-container">

      <div className="tech-stack-intro">
        <div className="tech-stack-intro-icon">
          <Code2 size={20} />
        </div>

        <div>
          <h3>Technology Architecture</h3>
          <p>
            Recommended tools and technologies for building your MVP.
          </p>
        </div>
      </div>

      <div className="tech-stack-grid">
        {stackCategories.map((category) => {
          const Icon = category.icon;
          const tags = getTags(category.value);
          const displayValue = tags.length
            ? tags.join(' · ')
            : 'Not specified';

          return (
            <article
              key={category.id}
              className="tech-category-card"
            >

              {/* Card Header */}
              <div className="tech-category-header">

                <div
                  className="tech-category-icon"
                  style={{
                    color: category.color,
                    backgroundColor: category.background,
                  }}
                >
                  <Icon size={21} />
                </div>

                <div className="tech-category-heading">
                  <span className="tech-category-label">
                    {category.label}
                  </span>

                  <p className="tech-category-description">
                    {category.description}
                  </p>
                </div>

                <div className="tech-category-arrow">
                  <ArrowUpRight size={16} />
                </div>

              </div>

              {/* Technology Name */}
              <div className="tech-category-value">
                {displayValue}
              </div>

              {/* Technology Tags */}
              {tags.length > 0 && (
                <div className="tech-tags-list">
                  {tags.map((tag, index) => (
                    <span
                      key={`${category.id}-${index}`}
                      className="tech-tag"
                      style={{
                        color: category.color,
                        backgroundColor: category.background,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="tech-category-footer">
                <span className="tech-category-status">
                  <span className="tech-status-dot" />
                  {tags.length > 0
                    ? 'Recommended technology'
                    : 'Awaiting selection'}
                </span>
              </div>

            </article>
          );
        })}
      </div>

    </div>
  );
};

export default TechStackCard;
