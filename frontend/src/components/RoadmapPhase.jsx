
import React from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  ListChecks,
  ArrowRight,
} from 'lucide-react';

import './RoadmapPhase.css';

const RoadmapPhase = ({ phase, isLast = false }) => {
  if (!phase) return null;

  const {
    phase: phaseNumber = 1,
    title = 'Development Phase',
    duration = '',
    tasks = [],
  } = phase;

  const taskList = Array.isArray(tasks)
    ? tasks
    : [tasks].filter(Boolean);

  const displayPhase = String(phaseNumber);

  return (
    <div className={`roadmap-phase ${isLast ? 'last-phase' : ''}`}>

      {/* Timeline Indicator */}
      <div className="roadmap-indicator">

        <div className="roadmap-phase-circle">
          <span>{displayPhase}</span>
        </div>

        {!isLast && (
          <div className="roadmap-connector" />
        )}

      </div>

      {/* Phase Content */}
      <div className="roadmap-content">

        <article className="roadmap-card">

          {/* Card Header */}
          <div className="roadmap-card-header">

            <div className="roadmap-heading">

              <span className="roadmap-phase-label">
                PHASE {displayPhase}
              </span>

              <h3 className="roadmap-phase-title">
                {title}
              </h3>

            </div>

            {duration && (
              <div className="roadmap-duration">
                <CalendarDays size={15} />
                <span>{duration}</span>
              </div>
            )}

          </div>

          {/* Tasks */}
          <div className="roadmap-tasks-section">

            <div className="roadmap-tasks-heading">
              <ListChecks size={16} />

              <span>
                Development Tasks
              </span>

              <span className="roadmap-task-count">
                {taskList.length}
              </span>
            </div>

            {taskList.length > 0 ? (
              <div className="roadmap-task-list">

                {taskList.map((task, index) => (
                  <div
                    className="roadmap-task-item"
                    key={index}
                  >
                    <div className="roadmap-task-icon">
                      <CheckCircle2 size={16} />
                    </div>

                    <span>{task}</span>
                  </div>
                ))}

              </div>
            ) : (
              <p className="roadmap-no-tasks">
                No tasks specified for this phase.
              </p>
            )}

          </div>

          {/* Card Footer */}
          <div className="roadmap-card-footer">
            <span className="roadmap-footer-label">
              Project milestone
            </span>

            <ArrowRight size={16} />
          </div>

        </article>

      </div>

    </div>
  );
};

export default RoadmapPhase;
