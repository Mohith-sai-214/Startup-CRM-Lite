import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LineChartCard({ data }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Conversion Trend</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Monthly conversion rate of leads marked as Won</p>
      </div>

      <div className="flex-1 min-h-[220px] w-full text-xs">
        {data.every(item => item.rate === 0) ? (
          <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            No conversion history available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
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
                formatter={(value) => [`${value}%`, 'Conversion Rate']}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#22C55E"
                strokeWidth={2.5}
                dot={{ r: 4, stroke: '#22C55E', strokeWidth: 2, fill: '#FFFFFF' }}
                activeDot={{ r: 6, fill: '#22C55E' }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
