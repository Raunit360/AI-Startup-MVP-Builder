import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getProjects,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
} from '../services/api';

/**
 * Custom hook to manage project state, search, and CRUD operations
 */
export const useProjects = (initialFetch = true) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all projects with optional query params (search, industry, status)
   */
  const fetchProjects = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProjects(params);
      // Response from interceptor is res.data which contains { success: true, data: [...] } or array
      const projectList = response.data || response || [];
      setProjects(Array.isArray(projectList) ? projectList : []);
      return projectList;
    } catch (err) {
      const errorMsg = err.message || 'Failed to load projects';
      setError(errorMsg);
      toast.error(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Quick search projects by title or description
   */
  const searchProjects = useCallback(
    async (query) => {
      return await fetchProjects({ search: query });
    },
    [fetchProjects]
  );

  /**
   * Create a new startup project
   */
  const createProject = useCallback(async (projectData) => {
    setLoading(true);
    try {
      const response = await apiCreateProject(projectData);
      const newProject = response.data || response;
      setProjects((prev) => [newProject, ...prev]);
      toast.success('Project created successfully!');
      return newProject;
    } catch (err) {
      const msg = err.message || 'Failed to create project';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing project
   */
  const updateProject = useCallback(async (id, updateData) => {
    setLoading(true);
    try {
      const response = await apiUpdateProject(id, updateData);
      const updatedProject = response.data || response;
      setProjects((prev) =>
        prev.map((item) => (item._id === id ? updatedProject : item))
      );
      toast.success('Project updated successfully!');
      return updatedProject;
    } catch (err) {
      const msg = err.message || 'Failed to update project';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a project
   */
  const deleteProject = useCallback(async (id) => {
    setLoading(true);
    try {
      await apiDeleteProject(id);
      setProjects((prev) => prev.filter((item) => item._id !== id));
      toast.success('Project deleted successfully');
      return true;
    } catch (err) {
      const msg = err.message || 'Failed to delete project';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialFetch) {
      fetchProjects();
    }
  }, [initialFetch, fetchProjects]);

  return {
    projects,
    setProjects,
    loading,
    error,
    fetchProjects,
    searchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};

export default useProjects;
