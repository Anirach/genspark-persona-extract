import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import type { RunStats } from "@/types/run";

interface StatsChartsProps {
  stats: RunStats;
}

export const StatsCharts = ({ stats }: StatsChartsProps) => {
  const coverageData = [
    { name: 'Discovered', value: stats.coverage.discovered },
    { name: 'Fetched', value: stats.coverage.fetched },
    { name: 'Kept', value: stats.coverage.kept },
  ];

  const freshnessData = Object.entries(stats.coverage.languages).map(([lang, count]) => ({ name: lang.toUpperCase(), value: count }));

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-4 rounded-lg border">
        <h4 className="mb-2 font-medium">Coverage</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={coverageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="p-4 rounded-lg border">
        <h4 className="mb-2 font-medium">Language Distribution</h4>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={freshnessData}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsCharts;
