import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BarChartCard({ data }) {
  const totalLeads = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Monthly Leads</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Total lead counts created during the last 6 months</p>
      </div>

      <div className="flex-1 min-h-[220px] w-full text-xs">
        {totalLeads === 0 && data.every(item => item.count === 0) ? (
          <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            No leads acquired in the last 6 months
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                allowDecimals={false}
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
                cursor={{ fill: 'rgba(241, 245, 249, 0.05)' }}
                formatter={(value) => [`${value} Leads`, 'New Leads']}
              />
              <Bar
                dataKey="count"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
