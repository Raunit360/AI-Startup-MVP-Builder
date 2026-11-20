
import { useState, useCallback, useEffect } from 'react';
import { getDashboardStats } from '../services/api';

const initialStats = {
  totalProjects: 0,
  totalPlans: 0,
  completedPlans: 0,
  avgTimeline: '3-6 months',
  recentProjects: [],
  recentActivity: [],
  projectsByIndustry: [],
  projectsByStatus: [],
};

export const useDashboard = () => {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDashboardStats();

      // Handle both direct API data and wrapped API responses
      const payload = response?.data ?? response ?? {};
      const data = payload?.data ?? payload;

      setStats({
        totalProjects: data.totalProjects ?? 0,
        totalPlans: data.totalPlans ?? 0,
        completedPlans: data.completedPlans ?? 0,
        avgTimeline: data.avgTimeline || '3-6 months',
        recentProjects: Array.isArray(data.recentProjects)
          ? data.recentProjects : [],
        recentActivity: Array.isArray(data.recentActivity)
          ? data.recentActivity : [],
        projectsByIndustry: Array.isArray(data.projectsByIndustry)
          ? data.projectsByIndustry : [],
        projectsByStatus: Array.isArray(data.projectsByStatus)
          ? data.projectsByStatus : [],
      });
    } catch (err) {
      console.warn('Dashboard stats fetch failed:', err.message);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

export default useDashboard;
