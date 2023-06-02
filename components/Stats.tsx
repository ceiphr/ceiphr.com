import { FunctionComponent, useEffect, useState } from 'react';

import classNames from 'classnames';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface HistogramProps {
    data: SimpleAnalyticsStats['histogram'];
}

const Histogram: FunctionComponent<HistogramProps> = ({ data }) => {
    // Format date to be more human-readable
    const formattedData = data.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }));

    const formatXAxis = (tickItem: number | string): string => {
        if (typeof tickItem === 'number' && tickItem >= 1000) {
            return `${tickItem / 1000}k`;
        }
        return tickItem.toString();
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart
                width={300}
                height={200}
                data={formattedData}
                margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0
                }}
            >
                <CartesianGrid stroke="rgb(17 24 39)" vertical={false} />
                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="rgb(107 114 128)"
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    width={30}
                    stroke="rgb(107 114 128)"
                    tickFormatter={formatXAxis}
                />
                <Tooltip />
                <Area type="basis" dataKey="pageviews" activeDot={false} />
                <Area type="basis" dataKey="visitors" activeDot={false} />
            </AreaChart>
        </ResponsiveContainer>
    );
};

interface Props {
    slug: string;
    className?: string;
}

const DEMO_STATS: SimpleAnalyticsStats = {
    path: '/blog/example-post',
    start: '2023-05-26T04:00:00.000Z',
    end: '2023-06-03T04:59:59.999Z',
    timezone: 'America/New_York',
    pageviews: 4232,
    visitors: 690,
    referrers: [],
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
            pageviews: 560,
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

const Stats: FunctionComponent<Props> = ({ slug, className }) => {
    const [stats, setStats] = useState<SimpleAnalyticsStats>();

    useEffect(() => {
        fetch(`/api/sa/${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        })
            .then((res) => res.json())
            .then((data) => setStats(DEMO_STATS))
            .catch((err) => console.error(err));
    }, [slug]);

    const numberWithCommas = (x: number | undefined) => {
        if (!x) return 0;
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    return (
        <div className={classNames('my-4 pr-8', className)}>
            <h2 className="text-3xl mt-4 mb-2">Analytics</h2>
            <div className="flex space-x-4 mb-4 py-1">
                <div>
                    <p className="text-gray-500 text-sm">Page Views</p>
                    <p className="text-3xl font-bold">
                        {numberWithCommas(stats?.pageviews)}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Visitors</p>
                    <p className="text-3xl font-bold">
                        {numberWithCommas(stats?.visitors)}
                    </p>
                </div>
            </div>
            <Histogram data={stats?.histogram ?? []} />
        </div>
    );
};

export default Stats;
