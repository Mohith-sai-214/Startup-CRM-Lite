import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HorizontalBarChartCard({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Lead Sources</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Acquisition channels distribution performance</p>
      </div>

      <div className="flex-1 min-h-[220px] w-full text-xs">
        {total === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            No source metrics logged
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(226, 232, 240, 0.4)" className="dark:stroke-slate-800/40" />
              <XAxis
                type="number"
                stroke="rgba(148, 163, 184, 0.8)"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                className="dark:fill-gray-500"
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="rgba(148, 163, 184, 0.8)"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                className="dark:fill-gray-500 font-medium"
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
                formatter={(value) => [`${value} Leads`, 'Leads']}
              />
              <Bar
                dataKey="value"
                fill="#2563EB"
                radius={[0, 4, 4, 0]}
                animationDuration={800}
                maxBarSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
