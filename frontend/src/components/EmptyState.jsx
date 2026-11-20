import React from 'react';
import { Link } from 'react-router-dom';
import { FolderPlus } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FolderPlus,
  title = 'No items found',
  description = 'Get started by creating your first project.',
  actionText,
  onAction,
  actionLink,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={32} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>

      {actionLink && actionText && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}

      {!actionLink && onAction && actionText && (
        <button type="button" onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
