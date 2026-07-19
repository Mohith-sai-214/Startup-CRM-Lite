import React, { useState } from 'react';

export default function SalesFunnelCard({ data }) {
  const [hoveredStage, setHoveredStage] = useState(null);

  // Total leads in funnel
  const total = data.reduce((sum, d) => sum + d.count, 0);

  // Staged SVG polygons coordinates (x,y points in viewBox 0 0 400 280)
  const funnelStages = [
    {
      id: 'new',
      name: 'New Leads',
      points: '80,15 320,15 280,65 120,65',
      color: '#3B82F6', // Blue
      count: data[0]?.count || 0
    },
    {
      id: 'contacted',
      name: 'Contacted',
      points: '120,65 280,65 240,110 160,110',
      color: '#2563EB', // Deeper Blue
      count: data[1]?.count || 0
    },
    {
      id: 'meeting',
      name: 'Meeting Scheduled',
      points: '160,110 240,110 240,150 160,150',
      color: '#F59E0B', // Amber/Orange
      count: data[2]?.count || 0
    },
    {
      id: 'proposal',
      name: 'Proposal Sent',
      points: '160,150 240,150 210,195 190,195',
      color: '#7C3AED', // Purple
      count: data[3]?.count || 0
    },
    {
      id: 'won',
      name: 'Closed Won',
      points: '90,195 310,195 200,245',
      color: '#22C55E', // Green
      count: data[4]?.count || 0
    }
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Sales Funnel</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Stage-by-stage conversion with pipeline momentum</p>
      </div>

      <div className="flex-grow flex flex-col md:flex-row items-center justify-between gap-6 py-2">
        {/* Interactive Funnel SVG */}
        <div className="relative w-full max-w-[260px] aspect-[4/3] flex items-center justify-center">
          <svg
            viewBox="0 0 400 260"
            className="w-full h-full drop-shadow-md overflow-visible"
          >
            {funnelStages.map((stage) => {
              const isHovered = hoveredStage === stage.id;
              // Conversion rate of this stage relative to total
              const conversion = total > 0 ? ((stage.count / total) * 100).toFixed(0) : 0;
              
              return (
                <g key={stage.id} className="cursor-pointer">
                  <polygon
                    points={stage.points}
                    fill={stage.color}
                    opacity={hoveredStage ? (isHovered ? 1 : 0.6) : 0.9}
                    className="transition-all duration-200"
                    onMouseEnter={() => setHoveredStage(stage.id)}
                    onMouseLeave={() => setHoveredStage(null)}
                  />
                  {/* Tooltip embedded inside SVG */}
                  {isHovered && (
                    <g transform="translate(200, 130)" className="pointer-events-none">
                      <rect
                        x="-70"
                        y="-45"
                        width="140"
                        height="48"
                        rx="6"
                        fill="var(--tooltip-bg)"
                        stroke="var(--tooltip-border)"
                        strokeWidth="1"
                      />
                      <text
                        y="-28"
                        textAnchor="middle"
                        fill="var(--tooltip-label)"
                        className="text-[10px] font-bold"
                      >
                        {stage.name}
                      </text>
                      <text
                        y="-12"
                        textAnchor="middle"
                        fill="var(--tooltip-text)"
                        className="text-[11px] font-semibold"
                      >
                        {stage.count} Leads ({conversion}%)
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Funnel Details Legend on the Right */}
        <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 md:min-w-[120px] text-[10px]">
          {funnelStages.map((stage) => {
            const conversion = total > 0 ? ((stage.count / total) * 100).toFixed(0) : 0;
            return (
              <div
                key={stage.id}
                className={`flex items-center justify-between gap-4 p-1.5 rounded-lg border transition-colors ${
                  hoveredStage === stage.id
                    ? 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50'
                    : 'bg-transparent border-transparent'
                }`}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                  <span className="font-medium truncate text-gray-700 dark:text-gray-300">{stage.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white shrink-0">
                  {stage.count} ({conversion}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
