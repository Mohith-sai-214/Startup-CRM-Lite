import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function PieChartCard({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const activeSlices = data.filter(item => item.value > 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, index, name, value }) => {
    const RADIAN = Math.PI / 180;
    // Position labels slightly outside the outer radius
    const radius = outerRadius + 14;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Truncate name if it's too long
    const displayName = name === 'Meeting Scheduled' ? 'Meeting' : name === 'Proposal Sent' ? 'Proposal' : name;

    return (
      <text
        x={x}
        y={y}
        fill={activeSlices[index]?.color || '#94A3B8'}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-[9px] font-semibold select-none"
      >
        {`${displayName}: ${value}`}
      </text>
    );
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Lead Status Distribution</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Distribution of leads in the active sales pipeline</p>
      </div>

      {/* Donut Chart Container */}
      <div className="flex-1 flex items-center justify-center min-h-[220px] relative">
        {total === 0 ? (
          <span className="text-xs text-gray-400 dark:text-gray-500">No leads to display</span>
        ) : (
          <div className="w-full h-full relative" style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                  itemStyle={{ color: 'var(--tooltip-text)' }}
                  labelStyle={{ color: 'var(--tooltip-label)', fontWeight: 'bold' }}
                  formatter={(value, name) => [`${value} Leads`, name]}
                />
                <Pie
                  data={activeSlices}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={{ strokeWidth: 1, stroke: 'rgba(148, 163, 184, 0.4)' }}
                  animationDuration={800}
                >
                  {activeSlices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label Indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-gray-900 dark:text-white">{total}</span>
              <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Leads</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend Grid Matching Mockup style */}
      <div className="mt-4 border-t border-gray-100 dark:border-slate-800/80 pt-4 grid grid-cols-3 gap-2 text-[10px] text-gray-600 dark:text-gray-400">
        {data.map((entry, idx) => {
          return (
            <div key={idx} className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="truncate">{entry.name} ({entry.value})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
