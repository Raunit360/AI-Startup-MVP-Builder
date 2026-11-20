
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Sparkles,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Rocket,
  Target,
  Lightbulb,
  Clock3,
  Building2,
  Users,
  FileText,
  WandSparkles,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createProject, generatePlan } from '../services/api';
import './CreateProject.css';

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'E-commerce',
  'Entertainment',
  'Food & Beverage',
  'Travel',
  'Real Estate',
  'Other',
];

const TIMELINES = [
  '1-3 months',
  '3-6 months',
  '6-12 months',
  '12+ months',
];

export const CreateProject = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: '',
    industry: 'Technology',
    timeline: '3-6 months',
    problem: '',
    targetAudience: '',
    businessIdea: location.state?.initialIdea || '',
    additionalRequirements: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);

  const completedFields = [
    formData.title,
    formData.problem,
    formData.targetAudience,
    formData.businessIdea,
  ].filter((field) => field.trim()).length;

  const progress = Math.round((completedFields / 4) * 100);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!formData.timeline) {
      newErrors.timeline = 'Please select a timeline';
    }

    if (!formData.problem.trim()) {
      newErrors.problem = 'Problem statement is required';
    } else if (formData.problem.length > 1000) {
      newErrors.problem = 'Problem statement cannot exceed 1000 characters';
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    } else if (formData.targetAudience.length > 500) {
      newErrors.targetAudience = 'Target audience cannot exceed 500 characters';
    }

    if (!formData.businessIdea.trim()) {
      newErrors.businessIdea = 'Business idea description is required';
    } else if (formData.businessIdea.length > 2000) {
      newErrors.businessIdea = 'Business idea cannot exceed 2000 characters';
    }

    if (formData.additionalRequirements.length > 1000) {
      newErrors.additionalRequirements =
        'Additional requirements cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSaveOnly = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please correct the highlighted errors');
      return;
    }

    setSubmitting(true);

    try {
      const response = await createProject(formData);
      const created = response.data || response;

      toast.success('Project created successfully!');
      navigate(`/projects/${created._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAndGenerate = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please complete all required fields');
      return;
    }

    setGenerating(true);

    try {
      const createRes = await createProject(formData);
      const created = createRes.data || createRes;
      const projectId = created._id;

      if (!projectId) {
        throw new Error('Project was created but its ID was not returned');
      }

      toast.loading(
        'AI is building your startup MVP plan...',
        { id: 'generating-plan' }
      );

      await generatePlan(projectId);

      toast.success('Your MVP Plan is ready!', {
        id: 'generating-plan',
      });

      navigate(`/projects/${projectId}/plan`);
    } catch (err) {
      toast.dismiss('generating-plan');
      toast.error(err.message || 'Unable to generate MVP plan');
    } finally {
      setGenerating(false);
    }
  };

  const isBusy = submitting || generating;

  return (
    <div className="create-project-page">
      <div className="create-project-topbar">
        <Link to="/projects" className="create-back-link">
          <ArrowLeft size={17} />
          Back to Projects
        </Link>

        <div className="create-topbar-status">
          <span className="create-status-dot" />
          New Workspace
        </div>
      </div>

      <div className="create-project-layout">
        <main className="create-project-main">
          <div className="create-page-heading">
            <div className="create-heading-icon">
              <Rocket size={24} />
            </div>

            <div>
              <span className="create-eyebrow">START SOMETHING GREAT</span>
              <h1>Create Your Startup Project</h1>
              <p>
                Share your idea and let AI transform it into a structured,
                actionable MVP development plan.
              </p>
            </div>
          </div>

          <div className="create-progress-card">
            <div className="create-progress-top">
              <div>
                <strong>Project information</strong>
                <span>Complete the required details below</span>
              </div>
              <strong className="create-progress-percent">
                {progress}%
              </strong>
            </div>

            <div className="create-progress-track">
              <div
                className="create-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="create-progress-caption">
              {completedFields} of 4 essential fields completed
            </div>
          </div>

          <form onSubmit={handleSaveOnly} className="create-project-form">
            {/* SECTION 1 */}
            <section className="create-form-section">
              <div className="create-section-heading">
                <div className="create-section-icon blue">
                  <Building2 size={20} />
                </div>
                <div>
                  <span className="create-section-step">STEP 01</span>
                  <h2>Project Overview</h2>
                  <p>Give your startup an identity.</p>
                </div>
              </div>

              <div className="create-form-group">
                <label htmlFor="title">
                  Startup / Project Name <span>*</span>
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. MediConnect, SkillBridge, QuickMeal AI"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={200}
                  disabled={isBusy}
                  className={errors.title ? 'create-input error' : 'create-input'}
                />

                {errors.title && (
                  <div className="create-error">
                    <AlertCircle size={14} />
                    {errors.title}
                  </div>
                )}
              </div>

              <div className="create-two-columns">
                <div className="create-form-group">
                  <label htmlFor="industry">
                    Industry / Domain <span>*</span>
                  </label>

                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    disabled={isBusy}
                    className="create-input"
                  >
                    {INDUSTRIES.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="create-form-group">
                  <label htmlFor="timeline">
                    Target Launch Timeline <span>*</span>
                  </label>

                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    disabled={isBusy}
                    className="create-input"
                  >
                    {TIMELINES.map((timeline) => (
                      <option key={timeline} value={timeline}>
                        {timeline}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section className="create-form-section">
              <div className="create-section-heading">
                <div className="create-section-icon purple">
                  <Target size={20} />
                </div>
                <div>
                  <span className="create-section-step">STEP 02</span>
                  <h2>Problem & Target Audience</h2>
                  <p>Understand the problem your startup solves.</p>
                </div>
              </div>

              <div className="create-form-group">
                <div className="create-label-row">
                  <label htmlFor="problem">
                    Problem Statement <span>*</span>
                  </label>
                  <span>{formData.problem.length}/1000</span>
                </div>

                <textarea
                  id="problem"
                  name="problem"
                  rows={4}
                  placeholder="What problem are you solving? Who experiences it, and why is it important? Describe the current challenges..."
                  value={formData.problem}
                  onChange={handleChange}
                  maxLength={1000}
                  disabled={isBusy}
                  className={errors.problem ? 'create-input error' : 'create-input'}
                />

                {errors.problem && (
                  <div className="create-error">
                    <AlertCircle size={14} />
                    {errors.problem}
                  </div>
                )}
              </div>

              <div className="create-form-group">
                <div className="create-label-row">
                  <label htmlFor="targetAudience">
                    Target Audience <span>*</span>
                  </label>
                  <span>{formData.targetAudience.length}/500</span>
                </div>

                <input
                  id="targetAudience"
                  name="targetAudience"
                  type="text"
                  placeholder="e.g. College students, small business owners, healthcare professionals"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  maxLength={500}
                  disabled={isBusy}
                  className={
                    errors.targetAudience
                      ? 'create-input error'
                      : 'create-input'
                  }
                />

                {errors.targetAudience && (
                  <div className="create-error">
                    <AlertCircle size={14} />
                    {errors.targetAudience}
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 3 */}
            <section className="create-form-section">
              <div className="create-section-heading">
                <div className="create-section-icon orange">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <span className="create-section-step">STEP 03</span>
                  <h2>Business Idea & Solution</h2>
                  <p>Explain how your solution will work.</p>
                </div>
              </div>

              <div className="create-form-group">
                <div className="create-label-row">
                  <label htmlFor="businessIdea">
                    Business Idea Description <span>*</span>
                  </label>
                  <span>{formData.businessIdea.length}/2000</span>
                </div>

                <textarea
                  id="businessIdea"
                  name="businessIdea"
                  rows={6}
                  placeholder="Describe your solution, key features, how users will interact with it, its value proposition, and what makes it different..."
                  value={formData.businessIdea}
                  onChange={handleChange}
                  maxLength={2000}
                  disabled={isBusy}
                  className={
                    errors.businessIdea
                      ? 'create-input error'
                      : 'create-input'
                  }
                />

                {errors.businessIdea && (
                  <div className="create-error">
                    <AlertCircle size={14} />
                    {errors.businessIdea}
                  </div>
                )}
              </div>

              <div className="create-form-group">
                <div className="create-label-row">
                  <label htmlFor="additionalRequirements">
                    Additional Requirements
                    <span className="optional-label">OPTIONAL</span>
                  </label>
                  <span>{formData.additionalRequirements.length}/1000</span>
                </div>

                <textarea
                  id="additionalRequirements"
                  name="additionalRequirements"
                  rows={3}
                  placeholder="Preferred technologies, budget limitations, integrations, compliance needs, or other constraints..."
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  maxLength={1000}
                  disabled={isBusy}
                  className="create-input"
                />

                {errors.additionalRequirements && (
                  <div className="create-error">
                    <AlertCircle size={14} />
                    {errors.additionalRequirements}
                  </div>
                )}
              </div>
            </section>

            {/* ACTIONS */}
            <div className="create-form-actions">
              <button
                type="button"
                className="create-cancel-button"
                onClick={() => navigate('/projects')}
                disabled={isBusy}
              >
                Cancel
              </button>

              <div className="create-submit-actions">
                <button
                  type="button"
                  className="create-save-button"
                  onClick={handleSaveOnly}
                  disabled={isBusy}
                >
                  {submitting ? (
                    <span className="create-spinner" />
                  ) : (
                    <Save size={17} />
                  )}
                  Save Draft
                </button>

                <button
                  type="button"
                  className="create-generate-button"
                  onClick={handleSaveAndGenerate}
                  disabled={isBusy}
                >
                  {generating ? (
                    <>
                      <span className="create-spinner light" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate MVP Plan
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="create-project-sidebar">
          <div className="create-ai-card">
            <div className="create-ai-icon">
              <WandSparkles size={23} />
            </div>

            <span className="create-ai-label">AI-POWERED WORKSPACE</span>
            <h3>From idea to MVP, faster.</h3>
            <p>
              Your information helps AI create a practical startup blueprint.
            </p>

            <div className="create-ai-features">
              <div>
                <CheckCircle2 size={17} />
                <span>Core MVP features</span>
              </div>
              <div>
                <CheckCircle2 size={17} />
                <span>Technology recommendations</span>
              </div>
              <div>
                <CheckCircle2 size={17} />
                <span>Development roadmap</span>
              </div>
              <div>
                <CheckCircle2 size={17} />
                <span>Risks and success metrics</span>
              </div>
            </div>
          </div>

          <div className="create-tips-card">
            <div className="create-tips-heading">
              <Lightbulb size={18} />
              <strong>Tips for a better plan</strong>
            </div>

            <p>
              Be specific about the problem, your intended users, and how
              your solution will help them.
            </p>

            <div className="create-tip-example">
              <span>GOOD EXAMPLE</span>
              <p>
                An appointment platform that helps patients find nearby
                doctors and book available time slots.
              </p>
            </div>
          </div>

          <div className="create-time-card">
            <Clock3 size={18} />
            <div>
              <strong>AI generation may take a little time</strong>
              <span>Your project will be saved before generation starts.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateProject;
