export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" style="fill: currentColor" viewBox="0 0 256 256">
    <g id="ARI Symbol">
        <path d="M0,128A128,128,0,1,0,128,0,128,128,0,0,0,0,128Zm166,37.26a12.8,12.8,0,0,1,12.8,12.8v1.14A12.8,12.8,0,0,1,166,192h-1.14a12.8,12.8,0,0,1-12.8-12.8v-1.14a12.8,12.8,0,0,1,12.8-12.8Zm-37.43,0a12.8,12.8,0,0,1,12.8,12.8v1.14a12.8,12.8,0,0,1-12.8,12.8h-1.14a12.8,12.8,0,0,1-12.8-12.8v-1.14a12.8,12.8,0,0,1,12.8-12.8Zm-37.43,0a12.8,12.8,0,0,1,12.8,12.8v1.14A12.8,12.8,0,0,1,91.14,192H90a12.8,12.8,0,0,1-12.8-12.8v-1.14A12.8,12.8,0,0,1,90,165.26ZM166,128a12.8,12.8,0,0,1,12.8,12.8v1.14a12.8,12.8,0,0,1-12.8,12.8h-1.14a12.8,12.8,0,0,1-12.8-12.8V140.8a12.8,12.8,0,0,1,12.8-12.8Zm-37.43-26.74a12.8,12.8,0,0,1,12.8,12.8v27.88a12.8,12.8,0,0,1-12.8,12.8h-1.14a12.8,12.8,0,0,1-12.8-12.8V114.06a12.8,12.8,0,0,1,12.8-12.8Zm-37.43,0a12.8,12.8,0,0,1,12.8,12.8v27.88a12.8,12.8,0,0,1-12.8,12.8H90a12.8,12.8,0,0,1-12.8-12.8V114.06A12.8,12.8,0,0,1,90,101.26ZM128.57,64a12.8,12.8,0,0,1,12.8,12.8v1.14a12.8,12.8,0,0,1-12.8,12.8h-1.14a12.8,12.8,0,0,1-12.8-12.8V76.8A12.8,12.8,0,0,1,127.43,64Z" />
    </g>
</svg>`;

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
