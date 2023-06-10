import { FunctionComponent, useEffect, useState } from 'react';

import {
    Bar,
    BarChart,
    Cell,
    LabelList,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts';

import { fetchStats } from '@utils/fetch';
import { formatThousands, numberWithCommas } from '@utils/numbers';

interface CustomLabelProps {
    x: number;
    y: number;
    width: number;
    height: number;
    value: SimpleAnalyticsReferrer;
}

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
                    right: -48,
                    left: 0,
                    bottom: 0
                }}
            >
                <YAxis dataKey="value" type="category" hide={true} />
                <XAxis dataKey="pageviews" type="number" hide={true} />
                <Bar dataKey="pageviews" fill="#1d4e71" barSize={28}>
                    <LabelList
                        dataKey={(dataObject: SimpleAnalyticsReferrer) => ({
                            value: dataObject.value,
                            pageviews: dataObject.pageviews
                        })}
                        position="insideLeft"
                        fill="#fff"
                        content={(props) => {
                            const {
                                x,
                                y,
                                height,
                                value: providedValue
                            } = props as unknown as CustomLabelProps;
                            const pageviews = formatThousands(
                                providedValue?.pageviews
                            );
                            const value = providedValue?.value;
                            return (
                                <g>
                                    <text
                                        x={x + 10}
                                        y={y + 2 + height / 2}
                                        fill="#fff"
                                        textAnchor="start-left"
                                        dominantBaseline="middle"
                                        fontWeight="bold"
                                    >
                                        {pageviews}
                                    </text>
                                    <text
                                        // This is a hacky way to left align the text
                                        x={x + 48 + String(pageviews).length}
                                        y={y + 2 + height / 2}
                                        fill="#fff"
                                        textAnchor="start"
                                        dominantBaseline="middle"
                                    >
                                        {value}
                                    </text>
                                </g>
                            );
                        }}
                    />
                    {data.map((_entry, index) => (
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
        }

        fetchStats(route ?? '')
            .then((data) => setStats(data))
            .catch((err) => console.error(err));
    }, [route, providedStats]);

    return (
        <div className={className}>
            <div className="flex space-x-4 mb-4 py-1">
                <div>
                    <p className="text-gray-500 text-sm">Referred Views</p>
                    <p className="text-3xl font-heading">
                        {numberWithCommas(totalReferrers ?? 0)}
                    </p>
                </div>
            </div>
            {sortedReferrers && <Chart data={sortedReferrers.slice(0, 10)} />}
        </div>
    );
};

export default Referrals;
