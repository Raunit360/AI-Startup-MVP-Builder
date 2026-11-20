
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Pencil,
  Trash2,
  Clock3,
  CalendarDays,
  CheckCircle2,
  ArrowRight,
  Users,
  Compass,
  Building2,
  Target,
  Lightbulb,
  FileText,
  Rocket,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { getProjectById, getPlan, generatePlan, deleteProject } from '../services/api';
import Badge from '../components/Badge';
import ConfirmModal from '../components/ConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import './ProjectDetails.css';

export const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProjectAndPlan = useCallback(async () => {
    setLoading(true);

    try {
      const projRes = await getProjectById(id);
      const projData = projRes.data || projRes;
      setProject(projData);

      try {
        const planRes = await getPlan(id);
        const planData = planRes.data || planRes;

        if (planData && (planData._id || planData.coreFeatures)) {
          setPlan(planData);
        } else {
          setPlan(null);
        }
      } catch {
        setPlan(null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load project details');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProjectAndPlan();
  }, [fetchProjectAndPlan]);

  const handleGeneratePlan = async () => {
    if (generating) return;

    setGenerating(true);

    toast.loading('AI is crafting your MVP plan...', {
      id: 'generate-plan-toast',
    });

    try {
      await generatePlan(id);

      toast.success('MVP Plan successfully generated!', {
        id: 'generate-plan-toast',
      });

      navigate(`/projects/${id}/plan`);
    } catch (err) {
      toast.dismiss('generate-plan-toast');
      toast.error(err.message || 'Failed to generate MVP plan');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);

    try {
      await deleteProject(id);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading project details..." />;
  }

  if (!project) return null;

  const hasPlan = Boolean(
    plan && (plan.coreFeatures?.length > 0 || plan._id)
  );

  const createdDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown date';

  return (
    <div className="project-details-page">

      {/* TOP NAVIGATION */}
      <div className="project-details-topbar">
        <Link to="/projects" className="project-details-back">
          <ArrowLeft size={17} />
          Back to Projects
        </Link>

        <span className="project-details-breadcrumb">
          Workspace / Project Overview
        </span>
      </div>

      {/* PROJECT HERO */}
      <section className="project-details-hero">

        <div className="project-hero-main">
          <div className="project-hero-badges">
            <Badge variant={project.industry}>
              {project.industry || 'Startup'}
            </Badge>

            <Badge variant={project.status}>
              {project.status || 'draft'}
            </Badge>
          </div>

          <span className="project-hero-eyebrow">
            STARTUP PROJECT OVERVIEW
          </span>

          <h1>{project.title}</h1>

          <p className="project-hero-description">
            {project.businessIdea || project.problem || 'Your startup project workspace.'}
          </p>

          <div className="project-hero-meta">
            <div>
              <Clock3 size={16} />
              <span>Timeline: <strong>{project.timeline || 'Not specified'}</strong></span>
            </div>

            <div>
              <CalendarDays size={16} />
              <span>Created: <strong>{createdDate}</strong></span>
            </div>
          </div>
        </div>

        <div className="project-hero-actions">
          {hasPlan ? (
            <Link
              to={`/projects/${id}/plan`}
              className="project-primary-action"
            >
              <Sparkles size={18} />
              View Full MVP Plan
              <ArrowRight size={17} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={generating}
              className="project-primary-action"
            >
              {generating ? (
                <>
                  <span className="project-button-spinner" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate AI MVP Plan
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          )}

          <div className="project-secondary-actions">
            <Link
              to={`/projects/${id}/edit`}
              className="project-edit-action"
            >
              <Pencil size={16} />
              Edit Project
            </Link>

            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="project-delete-action"
              title="Delete Project"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>

        <div className="project-hero-decoration">
          <Rocket size={100} />
        </div>
      </section>

      {/* PLAN STATUS */}
      <section className={`project-plan-status ${hasPlan ? 'ready' : 'pending'}`}>
        <div className="project-plan-status-left">
          <div className="project-plan-status-icon">
            {hasPlan ? (
              <CheckCircle2 size={24} />
            ) : (
              <Compass size={24} />
            )}
          </div>

          <div>
            <span className="project-plan-status-label">
              AI WORKSPACE
            </span>

            <h3>
              {hasPlan
                ? 'Your AI-generated MVP architecture is ready!'
                : 'Your MVP plan is waiting to be generated'}
            </h3>

            <p>
              {hasPlan
                ? `Your plan includes ${plan.coreFeatures?.length || 0} core features, ${plan.developmentRoadmap?.length || 0} development phases, and a recommended technology stack.`
                : 'Generate a complete startup blueprint with features, technology recommendations, roadmap, and risk analysis.'}
            </p>
          </div>
        </div>

        {hasPlan ? (
          <Link
            to={`/projects/${id}/plan`}
            className="project-plan-status-button"
          >
            Explore Plan <ArrowRight size={16} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={generating}
            className="project-plan-status-button"
          >
            <Sparkles size={16} />
            Generate Plan
          </button>
        )}
      </section>

      {/* PROJECT INFORMATION */}
      <div className="project-details-section-heading">
        <div>
          <span>PROJECT INFORMATION</span>
          <h2>Understand Your Startup</h2>
          <p>Review the problem, audience, and solution behind your idea.</p>
        </div>
      </div>

      <div className="project-information-grid">

        {/* BUSINESS IDEA */}
        <section className="project-information-card business-idea-card">
          <div className="project-information-heading">
            <div className="project-information-icon purple">
              <Lightbulb size={20} />
            </div>

            <div>
              <span>YOUR VISION</span>
              <h3>Business Idea & Solution</h3>
            </div>
          </div>

          <p className="project-information-text">
            {project.businessIdea || 'No business idea description provided.'}
          </p>
        </section>

        {/* PROBLEM */}
        <section className="project-information-card">
          <div className="project-information-heading">
            <div className="project-information-icon orange">
              <Target size={20} />
            </div>

            <div>
              <span>THE OPPORTUNITY</span>
              <h3>Problem Statement</h3>
            </div>
          </div>

          <p className="project-information-text">
            {project.problem || 'No problem statement provided.'}
          </p>
        </section>

        {/* AUDIENCE */}
        <section className="project-information-card">
          <div className="project-information-heading">
            <div className="project-information-icon blue">
              <Users size={20} />
            </div>

            <div>
              <span>WHO YOU SERVE</span>
              <h3>Target Audience</h3>
            </div>
          </div>

          <p className="project-information-text">
            {project.targetAudience || 'No target audience specified.'}
          </p>
        </section>

        {/* ADDITIONAL REQUIREMENTS */}
        <section className="project-information-card">
          <div className="project-information-heading">
            <div className="project-information-icon green">
              <FileText size={20} />
            </div>

            <div>
              <span>PROJECT SPECIFICATIONS</span>
              <h3>Additional Requirements</h3>
            </div>
          </div>

          <p className="project-information-text">
            {project.additionalRequirements || 'No additional requirements specified.'}
          </p>
        </section>
      </div>

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Project?"
        message={`Are you sure you want to permanently delete "${project.title}"? This will also remove the generated MVP plan.`}
        confirmText="Yes, Delete Project"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ProjectDetails;
