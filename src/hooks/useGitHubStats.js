import { useState, useEffect, useCallback, useRef } from 'react';
import { githubService } from '../api/services/github.service';

/**
 * Custom hook to dynamically retrieve and manage GitHub metrics.
 * @param {string} [username='Haiderali445']
 * @returns {{ stats: object|null, loading: boolean, error: string|null, refetch: () => Promise<void> }}
 */
export const useGitHubStats = (username = 'Haiderali445') => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const fetchStats = useCallback(async (targetUser) => {
    setLoading(true);
    setError(null);

    try {
      const data = await githubService.getUserStats(targetUser);
      if (isMountedRef.current) {
        setStats(data);
        setLoading(false);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || 'Failed to load GitHub statistics');
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchStats(username);

    return () => {
      isMountedRef.current = false;
    };
  }, [username, fetchStats]);

  const refetch = useCallback(() => {
    return fetchStats(username);
  }, [username, fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
};
