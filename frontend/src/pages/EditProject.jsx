import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProjectById, updateProject } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

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

export const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    industry: 'Technology',
    timeline: '3-6 months',
    problem: '',
    targetAudience: '',
    businessIdea: '',
    additionalRequirements: '',
  });

  const fetchProjectData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProjectById(id);
      const project = response.data || response;
      setFormData({
        title: project.title || '',
        industry: project.industry || 'Technology',
        timeline: project.timeline || '3-6 months',
        problem: project.problem || '',
        targetAudience: project.targetAudience || '',
        businessIdea: project.businessIdea || '',
        additionalRequirements: project.additionalRequirements || '',
      });
    } catch (err) {
      toast.error(err.message || 'Failed to load project details');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

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

    if (formData.additionalRequirements && formData.additionalRequirements.length > 1000) {
      newErrors.additionalRequirements = 'Additional requirements cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors before updating');
      return;
    }

    setSubmitting(true);
    try {
      await updateProject(id, formData);
      toast.success('Project details updated successfully');
      navigate(`/projects/${id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading project for editing..." />;
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.topBar}>
        <Link to={`/projects/${id}`} style={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Back to Project Overview</span>
        </Link>
      </div>

      <div style={styles.formCard}>
        <div style={styles.formHeader}>
          <div>
            <h2 style={styles.pageTitle}>Edit Startup Project</h2>
            <p style={styles.pageSubtitle}>
              Update your project hypothesis, problem definition, and requirements.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Section 1 */}
          <div style={styles.section}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Project Title <span className="required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className={`form-input ${errors.title ? 'has-error' : ''}`}
                value={formData.title}
                onChange={handleChange}
                maxLength={200}
                disabled={submitting}
              />
              {errors.title && <div className="form-error"><AlertCircle size={13} /> {errors.title}</div>}
            </div>

            <div style={styles.rowTwoCols}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="industry">
                  Industry <span className="required">*</span>
                </label>
                <select
                  id="industry"
                  name="industry"
                  className={`form-select ${errors.industry ? 'has-error' : ''}`}
                  value={formData.industry}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
                {errors.industry && <div className="form-error"><AlertCircle size={13} /> {errors.industry}</div>}
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="timeline">
                  Target Timeline <span className="required">*</span>
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  className={`form-select ${errors.timeline ? 'has-error' : ''}`}
                  value={formData.timeline}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  {TIMELINES.map((tl) => (
                    <option key={tl} value={tl}>
                      {tl}
                    </option>
                  ))}
                </select>
                {errors.timeline && <div className="form-error"><AlertCircle size={13} /> {errors.timeline}</div>}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div style={styles.section}>
            <div className="form-group">
              <div className="form-label">
                <span>Problem Statement <span className="required">*</span></span>
                <span className="char-count">{formData.problem.length} / 1000</span>
              </div>
              <textarea
                name="problem"
                className={`form-textarea ${errors.problem ? 'has-error' : ''}`}
                rows={3}
                value={formData.problem}
                onChange={handleChange}
                maxLength={1000}
                disabled={submitting}
              />
              {errors.problem && <div className="form-error"><AlertCircle size={13} /> {errors.problem}</div>}
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Target Audience <span className="required">*</span></span>
                <span className="char-count">{formData.targetAudience.length} / 500</span>
              </div>
              <input
                name="targetAudience"
                type="text"
                className={`form-input ${errors.targetAudience ? 'has-error' : ''}`}
                value={formData.targetAudience}
                onChange={handleChange}
                maxLength={500}
                disabled={submitting}
              />
              {errors.targetAudience && <div className="form-error"><AlertCircle size={13} /> {errors.targetAudience}</div>}
            </div>
          </div>

          {/* Section 3 */}
          <div style={styles.section}>
            <div className="form-group">
              <div className="form-label">
                <span>Business Idea Description <span className="required">*</span></span>
                <span className="char-count">{formData.businessIdea.length} / 2000</span>
              </div>
              <textarea
                name="businessIdea"
                className={`form-textarea ${errors.businessIdea ? 'has-error' : ''}`}
                rows={5}
                value={formData.businessIdea}
                onChange={handleChange}
                maxLength={2000}
                disabled={submitting}
              />
              {errors.businessIdea && <div className="form-error"><AlertCircle size={13} /> {errors.businessIdea}</div>}
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Additional Requirements & Constraints (Optional)</span>
                <span className="char-count">{formData.additionalRequirements.length} / 1000</span>
              </div>
              <textarea
                name="additionalRequirements"
                className={`form-textarea ${errors.additionalRequirements ? 'has-error' : ''}`}
                rows={2}
                value={formData.additionalRequirements}
                onChange={handleChange}
                maxLength={1000}
                disabled={submitting}
              />
              {errors.additionalRequirements && (
                <div className="form-error"><AlertCircle size={13} /> {errors.additionalRequirements}</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actionsBar}>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate(`/projects/${id}`)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {submitting ? (
                <>
                  <div className="spinner spinner-sm" style={{ borderTopColor: '#ffffff' }} />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    maxWidth: '860px',
    margin: '0 auto',
  },
  topBar: {
    marginBottom: '1.25rem',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  formCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  formHeader: {
    padding: '2rem 2.5rem',
    borderBottom: '1px solid #f3f4f6',
    backgroundColor: '#fafbfc',
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  pageSubtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  form: {
    padding: '2rem 2.5rem',
  },
  section: {
    marginBottom: '1.75rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #f3f4f6',
  },
  rowTwoCols: {
    display: 'flex',
    gap: '1.25rem',
  },
  actionsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '1rem',
  },
};

export default EditProject;
