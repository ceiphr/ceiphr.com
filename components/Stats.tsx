import { FunctionComponent, useEffect, useState } from 'react';

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface HistogramProps {
    data: SimpleAnalyticsStats['histogram'];
}

const Histogram: FunctionComponent<HistogramProps> = ({ data }) => {
    return (
        <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pageviews" fill="#8884d8" />
            <Bar dataKey="visitors" fill="#82ca9d" />
        </BarChart>
    );
};

interface Props {
    slug: string;
}

const Stats: FunctionComponent<Props> = ({ slug }) => {
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
            .then((data) => setStats(data))
            .catch((err) => console.error(err));
    }, [slug]);

    return (
        <div>
            <h2 className="text-3xl mt-4 mb-2">Stats</h2>
            <p>Views: {stats?.pageviews}</p>
            <p>Unique Visitors: {stats?.visitors}</p>
            <Histogram data={stats?.histogram ?? []} />
        </div>
    );
};

export default Stats;
