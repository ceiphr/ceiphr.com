import { FunctionComponent, useEffect, useState } from 'react';

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis
} from 'recharts';

import { DEMO_STATS } from '@utils/constants';
import { fetchStats } from '@utils/fetch';
import { numberWithCommas } from '@utils/numbers';

export const CustomTooltip: FunctionComponent<TooltipProps<number, string>> = ({
    active,
    payload,
    label
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/60 backdrop-blur-lg rounded-xl border border-gray-800 py-2 px-4">
                <p className="text-gray-500 text-sm mb-1">{label}</p>
                <table className="table-fixed">
                    <tbody>
                        {payload.map((item) => {
                            let label = item.name;
                            switch (item.name) {
                                case 'pageviews':
                                    label = 'Page Views';
                                    break;
                                case 'visitors':
                                    label = 'Visitors';
                                    break;
                            }

                            return (
                                <tr key={item.dataKey}>
                                    <td
                                        className="font-bold pr-2"
                                        style={{ color: item.color }}
                                    >
                                        {numberWithCommas(item.value)}
                                    </td>
                                    <td>{label}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    return null;
};

interface ChartProps {
    data: SimpleAnalyticsStats['histogram'];
}

const Chart: FunctionComponent<ChartProps> = ({ data }) => {
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
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'transparent' }}
                />
                <Area type="monotone" dataKey="pageviews" activeDot={false} />
                <Area
                    type="monotone"
                    dataKey="visitors"
                    activeDot={false}
                    stroke="#10b981"
                    fill="#10b981"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

interface HistogramProps {
    route?: string;
    className?: string;
    stats?: SimpleAnalyticsStats;
}

const Histogram: FunctionComponent<HistogramProps> = ({
    route,
    className,
    stats: providedStats
}) => {
    const [stats, setStats] = useState<SimpleAnalyticsStats | null>(null);

    // Page prop is mutually exclusive with stats
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
        <div className={className}>
            <div className="flex space-x-4 mb-4 py-1">
                <div>
                    <p className="text-gray-500 text-sm">Page Views</p>
                    <p className="text-3xl font-bold">
                        {numberWithCommas(stats?.pageviews ?? 0)}
                    </p>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Visitors</p>
                    <p className="text-3xl font-bold">
                        {numberWithCommas(stats?.visitors ?? 0)}
                    </p>
                </div>
            </div>
            <Chart data={stats?.histogram ?? []} />
        </div>
    );
};

export default Histogram;
