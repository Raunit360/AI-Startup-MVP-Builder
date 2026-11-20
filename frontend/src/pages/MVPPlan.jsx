
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  LayoutDashboard,
  CheckCircle2,
  Cpu,
  MapPin,
  AlertTriangle,
  BarChart3,
  Copy,
  Check,
  CalendarDays,
  Clock3,
  Target,
  Lightbulb,
  Users,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
  getPlan,
  generatePlan,
  getProjectById,
} from '../services/api';

import FeatureCard from '../components/FeatureCard';
import TechStackCard from '../components/TechStackCard';
import RoadmapPhase from '../components/RoadmapPhase';
import RiskCard from '../components/RiskCard';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

import './MVPPlan.css';

// Handle different API response structures
const unwrapResponse = (response) => {
  let result = response?.data ?? response;

  if (result?.data !== undefined) {
    result = result.data;
  }

  return result;
};

const unwrapPlan = (response) => {
  const result = unwrapResponse(response);

  if (result?.mvpPlan) return result.mvpPlan;
  if (result?.plan) return result.plan;

  return result;
};

export const MVPPlan = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  // Fetch project and MVP plan
  const fetchPlanAndProject = useCallback(async () => {
    setLoading(true);

    try {
      const [projectResult, planResult] = await Promise.allSettled([
        getProjectById(id),
        getPlan(id),
      ]);

      if (projectResult.status === 'fulfilled') {
        const projectData = unwrapResponse(projectResult.value);
        setProject(projectData?.project || projectData);
      } else {
        setProject(null);
      }

      if (planResult.status === 'fulfilled') {
        const planData = unwrapPlan(planResult.value);

        if (
          planData &&
          typeof planData === 'object' &&
          (
            planData.coreFeatures ||
            planData.technologyStack ||
            planData._id
          )
        ) {
          setPlan(planData);
        } else {
          setPlan(null);
        }
      } else {
        setPlan(null);
      }
    } catch (error) {
      console.error('Error loading MVP plan:', error);
      toast.error(error.message || 'Failed to load plan details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlanAndProject();
  }, [fetchPlanAndProject]);

  // Generate or regenerate MVP plan
  const handleRegenerate = async () => {
    if (regenerating) return;

    setRegenerating(true);

    toast.loading(
      'AI is rebuilding your MVP architecture...',
      { id: 'regen-toast' }
    );

    try {
      const response = await generatePlan(id);
      const newPlan = unwrapPlan(response);

      if (
        !newPlan ||
        typeof newPlan !== 'object' ||
        !(
          newPlan.coreFeatures ||
          newPlan.technologyStack ||
          newPlan._id
        )
      ) {
        throw new Error('The server returned an invalid MVP plan.');
      }

      setPlan(newPlan);

      toast.success('MVP Plan regenerated successfully!', {
        id: 'regen-toast',
      });
    } catch (error) {
      console.error('Plan generation failed:', error);

      toast.error(
        error.message || 'Failed to regenerate MVP plan',
        { id: 'regen-toast' }
      );
    } finally {
      setRegenerating(false);
    }
  };

  // Copy MVP plan JSON
  const handleCopyJSON = async () => {
    if (!plan) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(plan, null, 2)
      );

      setCopied(true);
      toast.success('MVP Plan JSON copied successfully!');

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Clipboard error:', error);

      toast.error(
        'Unable to copy JSON. Check browser clipboard permissions.'
      );
    }
  };

  // Download MVP plan JSON
  const handleDownloadJSON = () => {
    if (!plan) return;

    try {
      const blob = new Blob(
        [JSON.stringify(plan, null, 2)],
        { type: 'application/json' }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const fileName = (project?.title || 'startup-mvp')
        .trim()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();

      link.href = url;
      link.download = `${fileName || 'startup-mvp'}-mvp-plan.json`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      toast.success('MVP Plan downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Unable to download MVP plan.');
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="mvp-loading-container">
        <LoadingSpinner
          size="lg"
          message="Loading AI MVP Architecture..."
        />
      </div>
    );
  }

  // Empty state
  if (!plan && !regenerating) {
    return (
      <div className="mvp-plan-page">
        <div className="mvp-topbar">
          <Link
            to={`/projects/${id}`}
            className="mvp-back-link"
          >
            <ArrowLeft size={16} />
            Back to Project
          </Link>
        </div>

        <EmptyState
          icon={Sparkles}
          title="No MVP Architecture Plan Generated"
          description="Transform your startup idea into an actionable development roadmap, feature breakdown, and technology stack."
          actionText="Generate MVP Plan Now"
          onAction={handleRegenerate}
        />
      </div>
    );
  }

  // Plan data
  const coreFeatures = Array.isArray(plan?.coreFeatures)
    ? plan.coreFeatures
    : [];

  const optionalFeatures = Array.isArray(plan?.optionalFeatures)
    ? plan.optionalFeatures
    : [];

  const roadmap = Array.isArray(plan?.developmentRoadmap)
    ? plan.developmentRoadmap
    : [];

  const risks = Array.isArray(plan?.risks)
    ? plan.risks
    : [];

  const metrics = Array.isArray(plan?.successMetrics)
    ? plan.successMetrics
    : [];

  const technologyStack = plan?.technologyStack || {};

  const techCategories =
    typeof technologyStack === 'object' &&
    !Array.isArray(technologyStack)
      ? Object.keys(technologyStack).length
      : 0;

  const generatedDate = plan?.generatedAt
    ? new Date(plan.generatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  // Navigation tabs
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'features',
      label: 'Features',
      count: coreFeatures.length,
      icon: CheckCircle2,
    },
    {
      id: 'stack',
      label: 'Tech Stack',
      icon: Cpu,
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      count: roadmap.length,
      icon: MapPin,
    },
    {
      id: 'risks',
      label: 'Risks',
      count: risks.length,
      icon: AlertTriangle,
    },
    {
      id: 'metrics',
      label: 'Metrics',
      count: metrics.length,
      icon: BarChart3,
    },
  ];

  return (
    <div className="mvp-plan-page">

      {/* TOP BAR */}
      <div className="mvp-topbar">
        <Link
          to={`/projects/${id}`}
          className="mvp-back-link"
        >
          <ArrowLeft size={16} />
          Back to Project Overview
        </Link>

        <div className="mvp-top-actions">
          <button
            type="button"
            onClick={handleCopyJSON}
            className="mvp-export-button"
            disabled={!plan}
          >
            {copied ? (
              <Check size={15} />
            ) : (
              <Copy size={15} />
            )}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>

          <button
            type="button"
            onClick={handleDownloadJSON}
            className="mvp-export-button"
            disabled={!plan}
          >
            <Download size={15} />
            Export
          </button>

          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="mvp-regenerate-button"
          >
            <RefreshCw
              size={15}
              className={regenerating ? 'mvp-spinning' : ''}
            />

            {regenerating
              ? 'Regenerating...'
              : 'Regenerate Plan'}
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="mvp-hero">
        <div className="mvp-hero-content">

          <div className="mvp-hero-badges">
            <span className="mvp-ai-badge">
              <Sparkles size={14} />
              Gemini AI Blueprint
            </span>

            {project?.industry && (
              <Badge variant={project.industry}>
                {project.industry}
              </Badge>
            )}
          </div>

          <span className="mvp-hero-eyebrow">
            YOUR STARTUP BLUEPRINT
          </span>

          <h1>
            {project?.title || 'Startup MVP Architecture'}
          </h1>

          <p className="mvp-hero-description">
            Your AI-generated roadmap from business idea
            to launch-ready MVP.
          </p>

          <div className="mvp-hero-meta">
            <div>
              <Clock3 size={16} />

              <span>
                Target Timeline:{' '}
                <strong>
                  {plan?.estimatedTimeline ||
                    project?.timeline ||
                    '3-6 months'}
                </strong>
              </span>
            </div>

            <div>
              <CalendarDays size={16} />

              <span>
                Generated on:{' '}
                <strong>{generatedDate}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="mvp-hero-decoration">
          <Sparkles size={105} />
        </div>
      </section>

      {/* QUICK SUMMARY */}
      <div className="mvp-summary-grid">

        <div className="mvp-summary-card">
          <div className="mvp-summary-icon blue">
            <CheckCircle2 size={19} />
          </div>

          <div>
            <strong>{coreFeatures.length}</strong>
            <span>Core Features</span>
          </div>
        </div>

        <div className="mvp-summary-card">
          <div className="mvp-summary-icon purple">
            <Cpu size={19} />
          </div>

          <div>
            <strong>{techCategories}</strong>
            <span>Tech Categories</span>
          </div>
        </div>

        <div className="mvp-summary-card">
          <div className="mvp-summary-icon green">
            <MapPin size={19} />
          </div>

          <div>
            <strong>{roadmap.length}</strong>
            <span>Roadmap Phases</span>
          </div>
        </div>

        <div className="mvp-summary-card">
          <div className="mvp-summary-icon orange">
            <Target size={19} />
          </div>

          <div>
            <strong>{metrics.length}</strong>
            <span>Success Metrics</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <nav
        className="mvp-tabs"
        aria-label="MVP plan sections"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`mvp-tab ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={16} />

              <span>{tab.label}</span>

              {tab.count !== undefined && (
                <span className="mvp-tab-count">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* TAB CONTENT */}
      <div className="mvp-tab-content">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="mvp-overview-grid">

            <section className="mvp-info-card mvp-value-card">
              <div className="mvp-info-heading">
                <div className="mvp-info-icon purple">
                  <Sparkles size={20} />
                </div>

                <div>
                  <span>WHY IT MATTERS</span>
                  <h3>Core Value Proposition</h3>
                </div>
              </div>

              <p>
                {plan?.valueProposition ||
                  'High value proposition structured around automated workflows.'}
              </p>
            </section>

            <section className="mvp-info-card">
              <div className="mvp-info-heading">
                <div className="mvp-info-icon blue">
                  <Lightbulb size={20} />
                </div>

                <div>
                  <span>THE APPROACH</span>
                  <h3>Proposed Solution</h3>
                </div>
              </div>

              <p>
                {plan?.proposedSolution ||
                  project?.businessIdea ||
                  'Detailed solution overview.'}
              </p>
            </section>

            <section className="mvp-info-card">
              <div className="mvp-info-heading">
                <div className="mvp-info-icon red">
                  <Target size={20} />
                </div>

                <div>
                  <span>THE OPPORTUNITY</span>
                  <h3>Problem Addressed</h3>
                </div>
              </div>

              <p>
                {plan?.problemStatement ||
                  project?.problem ||
                  'Target user pain point.'}
              </p>
            </section>

            <section className="mvp-info-card mvp-value-card">
              <div className="mvp-info-heading">
                <div className="mvp-info-icon green">
                  <Users size={20} />
                </div>

                <div>
                  <span>WHO IT SERVES</span>
                  <h3>Target Users & Personas</h3>
                </div>
              </div>

              <p>
                {plan?.targetUsers ||
                  project?.targetAudience ||
                  'Target audience breakdown.'}
              </p>
            </section>
          </div>
        )}

        {/* FEATURES */}
        {activeTab === 'features' && (
          <div className="mvp-section">

            <div className="mvp-section-heading">
              <div>
                <span>PRODUCT SCOPE</span>
                <h2>Core MVP Features</h2>

                <p>
                  Essential capabilities needed for your first product launch.
                </p>
              </div>

              <span className="mvp-count-badge">
                {coreFeatures.length} Features
              </span>
            </div>

            {coreFeatures.length > 0 ? (
              <div className="mvp-features-grid">
                {coreFeatures.map((feature, index) => (
                  <FeatureCard
                    key={feature._id || index}
                    feature={feature}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="mvp-empty-note">
                No core features specified.
              </div>
            )}

            {optionalFeatures.length > 0 && (
              <div className="mvp-optional-section">

                <div className="mvp-section-heading">
                  <div>
                    <span>FUTURE RELEASES</span>
                    <h2>Optional & Post-MVP Features</h2>

                    <p>
                      Additional capabilities that can be introduced after launch.
                    </p>
                  </div>

                  <span className="mvp-count-badge optional">
                    {optionalFeatures.length} Optional
                  </span>
                </div>

                <div className="mvp-features-grid">
                  {optionalFeatures.map((feature, index) => (
                    <FeatureCard
                      key={feature._id || index}
                      feature={feature}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TECH STACK */}
        {activeTab === 'stack' && (
          <div className="mvp-section">

            <div className="mvp-section-heading">
              <div>
                <span>TECHNICAL ARCHITECTURE</span>
                <h2>Recommended Technology Stack</h2>

                <p>
                  Technologies recommended for development,
                  deployment, and scalability.
                </p>
              </div>
            </div>

            {techCategories > 0 ? (
              <TechStackCard
                technologyStack={technologyStack}
              />
            ) : (
              <div className="mvp-empty-note">
                No technology stack specified.
              </div>
            )}
          </div>
        )}

        {/* ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="mvp-section">

            <div className="mvp-section-heading">
              <div>
                <span>EXECUTION PLAN</span>
                <h2>Development Roadmap</h2>

                <p>
                  Milestone-driven phases from initial setup to product launch.
                </p>
              </div>

              <span className="mvp-count-badge">
                {roadmap.length} Phases
              </span>
            </div>

            <div className="mvp-roadmap-duration">
              <Clock3 size={17} />

              Estimated duration:

              <strong>
                {plan?.estimatedTimeline ||
                  project?.timeline ||
                  'Not specified'}
              </strong>
            </div>

            {roadmap.length > 0 ? (
              <div className="mvp-roadmap-list">
                {roadmap.map((phase, index) => (
                  <RoadmapPhase
                    key={phase._id || index}
                    phase={phase}
                    isLast={index === roadmap.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="mvp-empty-note">
                No roadmap phases specified.
              </div>
            )}
          </div>
        )}

        {/* RISKS */}
        {activeTab === 'risks' && (
          <div className="mvp-section">

            <div className="mvp-section-heading">
              <div>
                <span>RISK MANAGEMENT</span>
                <h2>Risk Assessment & Mitigation</h2>

                <p>
                  Potential challenges and strategies to reduce their impact.
                </p>
              </div>

              <span className="mvp-count-badge warning">
                {risks.length} Risks
              </span>
            </div>

            {risks.length > 0 ? (
              <div className="mvp-risk-list">
                {risks.map((risk, index) => (
                  <RiskCard
                    key={risk._id || index}
                    risk={risk}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="mvp-empty-note">
                No significant risks identified.
              </div>
            )}
          </div>
        )}

        {/* METRICS */}
        {activeTab === 'metrics' && (
          <div className="mvp-section">

            <div className="mvp-section-heading">
              <div>
                <span>MEASURING SUCCESS</span>
                <h2>Key Performance Indicators</h2>

                <p>
                  Metrics that help validate your startup's business hypothesis.
                </p>
              </div>

              <span className="mvp-count-badge">
                {metrics.length} Metrics
              </span>
            </div>

            <div className="mvp-metrics-card">
              <div className="mvp-table-wrapper">

                <table className="mvp-metrics-table">
                  <thead>
                    <tr>
                      <th>Key Metric</th>
                      <th>Target Goal</th>
                      <th>Measurement Timeline</th>
                    </tr>
                  </thead>

                  <tbody>
                    {metrics.length > 0 ? (
                      metrics.map((metric, index) => (
                        <tr key={metric._id || index}>
                          <td>
                            <strong>
                              {metric.metric || 'Not specified'}
                            </strong>
                          </td>

                          <td>
                            <span className="mvp-target-badge">
                              {metric.target || 'Not specified'}
                            </span>
                          </td>

                          <td>
                            {metric.timeline || 'Not specified'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="mvp-table-empty"
                        >
                          No success metrics defined.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="mvp-plan-footer">
        <div>
          <Sparkles size={17} />
          <span>Generated with Gemini AI · LaunchCraft</span>
        </div>

        <Link
          to={`/projects/${id}`}
          className="mvp-footer-link"
        >
          Project Overview
          <ArrowLeft size={14} />
        </Link>
      </div>
    </div>
  );
};

export default MVPPlan;
