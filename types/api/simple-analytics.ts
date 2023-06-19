// Simple Analytics API types

interface SimpleAnalyticsReferrer {
    value: string;
    pageviews: number;
    visitors: number;
}

interface SimpleAnalyticsStats {
    path: string;
    start: string;
    end: string;
    timezone: string;
    pageviews: number;
    visitors: number;
    referrers: SimpleAnalyticsReferrer[];
    histogram: {
        date: string;
        pageviews: number;
        visitors: number;
    }[];
}
