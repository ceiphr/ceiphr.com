import { FunctionComponent, useEffect, useState } from 'react';

import classNames from 'classnames';
import {
    Bar,
    BarChart,
    Cell,
    LabelList,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts';

import { DEMO_STATS } from '@utils/constants';
import { fetchStats } from '@utils/fetch';
import { numberWithCommas } from '@utils/numbers';

const Chart = ({ data }: { data: SimpleAnalyticsReferrer[] }) => {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart
                width={300}
                height={200}
                data={data}
                layout="vertical"
                margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0
                }}
            >
                <YAxis dataKey="value" type="category" hide={true} />
                <XAxis dataKey="pageviews" type="number" hide={true} />
                <Bar dataKey="pageviews" fill="#1d4e71" barSize={28}>
                    <LabelList
                        dataKey="value"
                        position="insideLeft"
                        fill="#fff"
                    />
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} radius={8} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

interface ReferrerProps {
    route?: string;
    className?: string;
    stats?: SimpleAnalyticsStats;
}

const Referrals: FunctionComponent<ReferrerProps> = ({
    route,
    className,
    stats: providedStats
}) => {
    const [stats, setStats] = useState<SimpleAnalyticsStats | null>(null);
    const sortedReferrers = stats?.referrers.sort(
        (a, b) => b.pageviews - a.pageviews
    );
    const totalReferrers = stats?.referrers.reduce(
        (acc, curr) => acc + curr.pageviews,
        0
    );

    if (route && providedStats) {
        throw new Error(
            'Page prop is mutually exclusive with stats prop. Please only provide one.'
        );
    }

    useEffect(() => {
        if (providedStats) {
            setStats(providedStats);
            return;
        } else if (process.env.NODE_ENV === 'development') {
            setStats(DEMO_STATS);
            return;
        }

        fetchStats(route ?? '')
            .then((data) => setStats(data))
            .catch((err) => console.error(err));
    }, [route, providedStats]);

    return (
        <div className={classNames('my-4', className)}>
            <div className="flex space-x-4 mb-4 py-1">
                <div>
                    <p className="text-gray-500 text-sm">Referred Views</p>
                    <p className="text-3xl font-bold">
                        {numberWithCommas(totalReferrers ?? 0)}
                    </p>
                </div>
            </div>
            {sortedReferrers && <Chart data={sortedReferrers.slice(0, 10)} />}
        </div>
    );
};

export default Referrals;
