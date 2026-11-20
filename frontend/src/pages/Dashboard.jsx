
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Sparkles,
  CheckCircle2,
  Clock3,
  Plus,
  ArrowRight,
  Activity,
  Zap,
  Rocket,
  CalendarDays,
  MoreHorizontal,
  BriefcaseBusiness,
} from 'lucide-react';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import useDashboard from '../hooks/useDashboard';
import useProjects from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

import './Dashboard.css';

const CHART_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ec4899',
];

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    stats = {},
    loading: dashboardLoading,
    refetch,
  } = useDashboard();

  const { deleteProject } = useProjects(false);

  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const recentProjects = Array.isArray(stats?.recentProjects)
    ? stats.recentProjects
    : [];

  const recentActivity = Array.isArray(stats?.recentActivity)
    ? stats.recentActivity
    : [];

  const projectsByIndustry = Array.isArray(stats?.projectsByIndustry)
    ? stats.projectsByIndustry
    : [];

  const projectsByStatus = Array.isArray(stats?.projectsByStatus)
    ? stats.projectsByStatus
    : [];

  const metrics = [
    {
      label: 'Total Projects',
      value: stats?.totalProjects ?? 0,
      description: 'Projects in your workspace',
      icon: FolderOpen,
      color: 'blue',
    },
    {
      label: 'MVP Plans Generated',
      value: stats?.totalPlans ?? 0,
      description: 'AI-generated business plans',
      icon: Sparkles,
      color: 'purple',
    },
    {
      label: 'Completed Plans',
      value: stats?.completedPlans ?? 0,
      description: 'Completed architectures',
      icon: CheckCircle2,
      color: 'green',
    },
    {
      label: 'Average Timeline',
      value: stats?.avgTimeline || '—',
      description: 'Target delivery duration',
      icon: Clock3,
      color: 'orange',
    },
  ];

  const formatActivityTime = (timestamp) => {
    if (!timestamp) return 'Recently';

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return 'Recently';

    return date.toLocaleString([], {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete || deleteLoading) return;

    setDeleteLoading(true);

    try {
      await deleteProject(projectToDelete._id);
      setProjectToDelete(null);
      await refetch();
    } catch (error) {
      console.error('Project deletion failed:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="dashboard-page">

      {/* WELCOME BANNER */}
      <section className="dashboard-welcome">
        <div className="welcome-content">

          <div className="welcome-label">
            <span className="welcome-label-icon">
              <Sparkles size={14} />
            </span>
            STARTUP WORKSPACE
          </div>

          <h1>
            Turn your next big idea
            <br />
            into a <span>real business.</span>
          </h1>

          <p>
            Plan your startup, discover essential MVP features,
            choose the right technology and build your development
            roadmap in one workspace.
          </p>

          <div className="welcome-actions">
            <button
              type="button"
              className="dashboard-primary-button"
              onClick={() => navigate('/projects/new')}
            >
              <Plus size={17} />
              Create New Project
              <ArrowRight size={16} />
            </button>

            <Link
              to="/projects"
              className="dashboard-secondary-button"
            >
              Explore Projects
            </Link>
          </div>
        </div>

        <div className="welcome-visual" aria-hidden="true">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="visual-main-icon">
            <Rocket size={48} strokeWidth={1.5} />
          </div>

          <div className="floating-card floating-card-top">
            <Sparkles size={16} />
            <span>AI-powered planning</span>
          </div>

          <div className="floating-card floating-card-bottom">
            <CheckCircle2 size={17} />
            <span>Ready to launch</span>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="dashboard-metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article className="metric-card" key={metric.label}>
              <div className="metric-card-top">
                <div className={`metric-icon ${metric.color}`}>
                  <Icon size={21} />
                </div>

                <span className="metric-menu">
                  <MoreHorizontal size={19} />
                </span>
              </div>

              <div className="metric-value">
                {dashboardLoading ? (
                  <span className="metric-skeleton" />
                ) : (
                  metric.value
                )}
              </div>

              <div className="metric-label">{metric.label}</div>

              <div className="metric-description">
                {metric.description}
              </div>
            </article>
          );
        })}
      </section>

      {/* ANALYTICS CHARTS */}
      <section className="dashboard-charts-grid">

        {/* INDUSTRY DONUT CHART */}
        <div className="dashboard-chart-card">
          <div className="chart-heading">
            <div>
              <h3>Projects by Industry</h3>
              <p>Distribution of your startup ideas</p>
            </div>

            <div className="chart-heading-icon">
              <BriefcaseBusiness size={19} />
            </div>
          </div>

          {dashboardLoading ? (
            <div className="chart-empty">
              Loading industry analytics...
            </div>
          ) : projectsByIndustry.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={projectsByIndustry}
                  dataKey="count"
                  nameKey="industry"
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  stroke="none"
                >
                  {projectsByIndustry.map((item, index) => (
                    <Cell
                      key={item.industry || index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [value, 'Projects']}
                />

                <Legend
                  verticalAlign="bottom"
                  height={35}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">
              <BriefcaseBusiness size={28} />
              <span>No industry data available yet.</span>
              <small>Create projects to see your industry distribution.</small>
            </div>
          )}
        </div>

        {/* PROJECT STATUS BAR CHART */}
        <div className="dashboard-chart-card">
          <div className="chart-heading">
            <div>
              <h3>Projects by Status</h3>
              <p>Current progress across your projects</p>
            </div>

            <div className="chart-heading-icon">
              <Activity size={19} />
            </div>
          </div>

          {dashboardLoading ? (
            <div className="chart-empty">
              Loading project analytics...
            </div>
          ) : projectsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={projectsByStatus}
                margin={{
                  top: 15,
                  right: 15,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#edf0f6"
                />

                <XAxis
                  dataKey="status"
                  tick={{ fill: '#7b8498', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#7b8498', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [value, 'Projects']}
                  cursor={{ fill: '#f4f5ff' }}
                />

                <Bar
                  dataKey="count"
                  name="Projects"
                  fill="#6366f1"
                  radius={[7, 7, 0, 0]}
                  maxBarSize={55}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">
              <Activity size={28} />
              <span>No project status data available yet.</span>
              <small>Your project progress will appear here.</small>
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="dashboard-main-grid">

        {/* RECENT PROJECTS */}
        <div className="dashboard-projects-section">
          <div className="dashboard-section-heading">
            <div>
              <div className="section-title-row">
                <div className="section-heading-icon">
                  <BriefcaseBusiness size={18} />
                </div>

                <h2>Recent Projects</h2>
              </div>

              <p>
                Continue working on your latest startup ideas.
              </p>
            </div>

            <Link to="/projects" className="dashboard-view-all">
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {dashboardLoading ? (
            <div className="dashboard-project-grid">
              {[1, 2, 3, 4].map((item) => (
                <div className="project-loading-card" key={item}>
                  <div className="loading-line short" />
                  <div className="loading-line long" />
                  <div className="loading-line medium" />
                  <div className="loading-line short" />
                </div>
              ))}
            </div>
          ) : recentProjects.length > 0 ? (
            <div className="dashboard-project-grid">
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onDelete={(item) => setProjectToDelete(item)}
                />
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <EmptyState
                icon={FolderOpen}
                title="No Startup Projects Yet"
                description="Create your first startup project and turn your idea into an actionable MVP plan."
                actionText="Create First Project"
                actionLink="/projects/new"
              />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <aside className="dashboard-right-column">

          {/* QUICK ACTION */}
          <div className="quick-action-card">
            <div className="quick-action-top">
              <div className="quick-action-icon">
                <Zap size={21} />
              </div>

              <span className="quick-action-tag">
                GET STARTED
              </span>
            </div>

            <h3>Have a new idea?</h3>

            <p>
              Start with your business concept. Build a structured
              MVP plan with features, technology and milestones.
            </p>

            <button
              type="button"
              className="quick-action-button"
              onClick={() => navigate('/projects/new')}
            >
              Start building
              <ArrowRight size={16} />
            </button>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="activity-card">
            <div className="activity-card-heading">
              <div>
                <div className="section-title-row">
                  <div className="section-heading-icon activity-heading-icon">
                    <Activity size={18} />
                  </div>

                  <h3>Recent Activity</h3>
                </div>

                <p>Your latest workspace updates</p>
              </div>

              <span
                className="activity-live-dot"
                title="Activity feed"
              />
            </div>

            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    className="activity-item"
                    key={activity._id || index}
                  >
                    <div className="activity-timeline">
                      <div className="activity-dot" />

                      {index !== recentActivity.length - 1 && (
                        <div className="activity-line" />
                      )}
                    </div>

                    <div className="activity-details">
                      <div className="activity-description">
                        {activity.description ||
                          activity.action ||
                          'Project updated'}
                      </div>

                      <div className="activity-time">
                        <CalendarDays size={12} />
                        {formatActivityTime(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="activity-empty">
                  <Activity size={24} />
                  <span>No recent activity yet.</span>
                  <small>
                    Your project updates will appear here.
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* WORKSPACE TIP */}
          <div className="workspace-tip">
            <div className="tip-icon">
              <Sparkles size={17} />
            </div>

            <div>
              <strong>Startup tip</strong>

              <p>
                Start with a focused MVP. Build essential features
                before expanding your product.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* DELETE CONFIRMATION */}
      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        title="Delete Startup Project?"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}"? All associated MVP plans and roadmaps will also be deleted.`}
        confirmText="Yes, Delete Project"
        onConfirm={handleDeleteConfirm}
        onClose={() => setProjectToDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Dashboard;
