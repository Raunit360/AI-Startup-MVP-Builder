import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  FolderOpen,
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Sparkles,
} from 'lucide-react';
import useProjects from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

const INDUSTRIES = [
  'All Industries',
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

const STATUSES = ['All Statuses', 'draft', 'analyzing', 'completed'];

export const Projects = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search parameter sync
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'alphabetical'

  const { projects, loading, deleteProject, fetchProjects } = useProjects();
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Sync external search param changes
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All Industries');
    setSelectedStatus('All Statuses');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedIndustry !== 'All Industries' ||
    selectedStatus !== 'All Statuses';

  // Filter and sort client side
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Search query filter (title, businessIdea, problem, industry)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = project.title?.toLowerCase().includes(q);
          const matchIdea = project.businessIdea?.toLowerCase().includes(q);
          const matchProblem = project.problem?.toLowerCase().includes(q);
          const matchIndustry = project.industry?.toLowerCase().includes(q);
          if (!matchTitle && !matchIdea && !matchProblem && !matchIndustry) {
            return false;
          }
        }

        // Industry filter
        if (selectedIndustry !== 'All Industries') {
          if (project.industry !== selectedIndustry) return false;
        }

        // Status filter
        if (selectedStatus !== 'All Statuses') {
          if (project.status !== selectedStatus) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === 'alphabetical') {
          return (a.title || '').localeCompare(b.title || '');
        }
        return 0;
      });
  }, [projects, searchQuery, selectedIndustry, selectedStatus, sortBy]);

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteProject(projectToDelete._id);
      setProjectToDelete(null);
    } catch (err) {
      // Handled in hook toast
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Startup Projects</h2>
          <p style={styles.subtitle}>
            Explore, manage, and inspect AI-generated MVP plans for your ventures ({filteredProjects.length}{' '}
            {filteredProjects.length === 1 ? 'project' : 'projects'})
          </p>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/projects/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          <span>New Startup Project</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="card" style={styles.filterCard}>
        <div style={styles.filterGrid}>
          {/* Search Input */}
          <div style={{ flex: 2, minWidth: '240px' }}>
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search projects by name, idea, or problem..."
            />
          </div>

          {/* Industry Filter */}
          <div style={{ flex: 1, minWidth: '160px' }}>
            <select
              className="form-select"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              aria-label="Filter by industry"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ flex: 1, minWidth: '140px' }}>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by status"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st === 'All Statuses'
                    ? st
                    : st.charAt(0).toUpperCase() + st.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div style={{ flex: 1, minWidth: '140px' }}>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort projects"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Name (A-Z)</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleResetFilters}
              style={styles.clearFiltersBtn}
            >
              <X size={15} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid / Content Area */}
      {loading ? (
        <div style={styles.projectsGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card" style={{ padding: '1.5rem', height: '240px' }}>
              <div className="skeleton" style={{ height: '20px', width: '35%', marginBottom: '14px' }} />
              <div className="skeleton" style={{ height: '24px', width: '85%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '8px' }} />
              <div className="skeleton" style={{ height: '14px', width: '70%', marginBottom: '24px' }} />
              <div className="skeleton" style={{ height: '36px', width: '60%' }} />
            </div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div style={styles.projectsGrid}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={(proj) => setProjectToDelete(proj)}
            />
          ))}
        </div>
      ) : hasActiveFilters ? (
        <EmptyState
          icon={Search}
          title="No Matching Projects Found"
          description="None of your startup projects matched the selected filters. Try broadening your keywords or resetting filters."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <EmptyState
          icon={FolderOpen}
          title="No Startup Projects Created Yet"
          description="Create your first startup project to generate high-fidelity AI MVP specifications, roadmap timelines, and tech stacks."
          actionText="Create New Project"
          actionLink="/projects/new"
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        title="Delete Project?"
        message={`Are you sure you want to permanently remove "${projectToDelete?.title}"? This cannot be undone.`}
        confirmText="Delete Project"
        onConfirm={handleDeleteConfirm}
        onClose={() => setProjectToDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '1.625rem',
    fontWeight: 800,
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  filterCard: {
    padding: '1rem 1.25rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
  },
  filterGrid: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    flexWrap: 'wrap',
  },
  clearFiltersBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    color: '#ef4444',
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
};

export default Projects;
