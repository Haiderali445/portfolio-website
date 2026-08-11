import { useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolio.service';

export const usePortfolioData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const portfolioData = await portfolioService.getPortfolio();
                if (isMounted) {
                    setData(portfolioData);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    console.error("Error fetching portfolio data:", err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, loading, error };
};
