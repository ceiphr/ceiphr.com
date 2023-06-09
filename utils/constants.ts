export const DEMO_STATS: SimpleAnalyticsStats = {
    path: '/blog/example-post',
    start: '2023-05-26T04:00:00.000Z',
    end: '2023-06-03T04:59:59.999Z',
    timezone: 'America/New_York',
    pageviews: 4232,
    visitors: 690,
    referrers: [
        {
            value: 'google.com',
            pageviews: 1012,
            visitors: 4
        },
        {
            value: 'news.ycombinator.com',
            pageviews: 42,
            visitors: 7
        },
        {
            value: 'reddit.com',
            pageviews: 420,
            visitors: 23
        },
        {
            value: 'facebook.com',
            pageviews: 134,
            visitors: 14
        },
        {
            value: 'twitter.com',
            pageviews: 45,
            visitors: 17
        }
    ],
    histogram: [
        {
            date: '2023-05-26',
            pageviews: 12,
            visitors: 4
        },
        {
            date: '2023-05-27',
            pageviews: 42,
            visitors: 7
        },
        {
            date: '2023-05-28',
            pageviews: 220,
            visitors: 23
        },
        {
            date: '2023-05-29',
            pageviews: 34,
            visitors: 14
        },
        {
            date: '2023-05-30',
            pageviews: 45,
            visitors: 17
        },
        {
            date: '2023-05-31',
            pageviews: 1560,
            visitors: 343
        },
        {
            date: '2023-06-01',
            pageviews: 455,
            visitors: 234
        },
        {
            date: '2023-06-02',
            pageviews: 123,
            visitors: 45
        }
    ]
};
