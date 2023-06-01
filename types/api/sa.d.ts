// Simple Analytics API types

interface SimpleAnalyticsStats {
    path: string;
    start: string;
    end: string;
    timezone: string;
    pageviews: number;
    visitors: number;
    referrers: {
        value: string;
        pageviews: number;
        visitors: number;
    };
    histogram: {
        date: string;
        pageviews: number;
        visitors: number;
    };
}
