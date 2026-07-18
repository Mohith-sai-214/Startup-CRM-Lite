import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AreaChartCard({ data }) {
  const hasData = data.some(item => item.revenue > 0);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Revenue Trend</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Monthly closed won deal values tracking growth</p>
      </div>

      <div className="flex-1 min-h-[220px] w-full text-xs">
        {!hasData ? (
          <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            No revenue recorded in this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.4)" className="dark:stroke-slate-800/40" />
              <XAxis
                dataKey="month"
                stroke="rgba(148, 163, 184, 0.8)"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                className="dark:fill-gray-500"
              />
              <YAxis
                stroke="rgba(148, 163, 184, 0.8)"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                className="dark:fill-gray-500"
                tickFormatter={(value) => {
                  if (value >= 100000) return `${value / 100000}L`;
                  if (value >= 1000) return `${value / 1000}K`;
                  return value;
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
                labelStyle={{ color: 'var(--tooltip-label)', fontWeight: 'bold' }}
                itemStyle={{ color: 'var(--tooltip-text)' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue Won']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
