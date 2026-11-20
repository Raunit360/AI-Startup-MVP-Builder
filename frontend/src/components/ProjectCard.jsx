
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock3,
  ArrowUpRight,
  ArrowRight,
  Pencil,
  Trash2,
  Sparkles,
  FolderKanban,
} from 'lucide-react';
import Badge from './Badge';
import './ProjectCard.css';

export const ProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();

  if (!project) return null;

  const {
    _id,
    title,
    businessIdea,
    problem,
    industry,
    timeline,
    status = 'draft',
    createdAt,
  } = project;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  const description =
    businessIdea || problem || 'No description provided yet.';

  const handleCardClick = () => {
    navigate(`/projects/${_id}`);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className="project-card"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`Open project ${title || 'Untitled project'}`}
    >
      <div className="project-card-top">
        <div className="project-card-icon">
          <FolderKanban size={22} />
        </div>

        <div className="project-card-badges">
          <Badge variant={industry}>{industry || 'Startup'}</Badge>
          <Badge variant={status}>{status}</Badge>
        </div>

        <ArrowUpRight className="project-card-open-icon" size={19} />
      </div>

      <div className="project-card-content">
        <h3 className="project-card-title">
          {title || 'Untitled Project'}
        </h3>

        <p className="project-card-description">
          {description}
        </p>
      </div>

      <div className="project-card-meta">
        <div className="project-meta-item">
          <Clock3 size={15} />
          <span>{timeline || '3-6 months'}</span>
        </div>

        <div className="project-meta-item">
          <CalendarDays size={15} />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div
        className="project-card-footer"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="project-card-actions">
          <Link
            to={`/projects/${_id}`}
            className="project-action-link"
          >
            View <ArrowRight size={14} />
          </Link>

          <Link
            to={`/projects/${_id}/edit`}
            className="project-action-link"
          >
            <Pencil size={14} />
            Edit
          </Link>

          {status === 'completed' && (
            <Link
              to={`/projects/${_id}/plan`}
              className="project-plan-link"
            >
              <Sparkles size={14} />
              MVP Plan
            </Link>
          )}
        </div>

        <button
          type="button"
          className="project-delete-button"
          onClick={() => onDelete?.(project)}
          title="Delete project"
          aria-label={`Delete ${title || 'project'}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
};

export default ProjectCard;
