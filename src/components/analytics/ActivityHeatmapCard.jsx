import React from 'react';

export default function ActivityHeatmapCard({ data }) {
  // Activity coloring helper: returns background colors based on count
  const getColorClass = (count) => {
    if (!count) return 'bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/80';
    if (count === 1) return 'bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40';
    if (count === 2) return 'bg-blue-300 dark:bg-blue-700/60 hover:bg-blue-400 dark:hover:bg-blue-600/70';
    if (count === 3) return 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500';
    return 'bg-blue-700 dark:bg-blue-500 hover:bg-blue-800 dark:hover:bg-blue-400';
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col h-full animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Activity Heatmap</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Lead creation and pipeline sales activity tracking over time</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[9px] text-gray-500 dark:text-gray-400">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800/60" />
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-100 dark:bg-blue-900/30" />
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-300 dark:bg-blue-700/60" />
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 dark:bg-blue-600" />
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-700 dark:bg-blue-500" />
          <span>More</span>
        </div>
      </div>

      {/* Grid container: Columns of Months */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-x-auto pb-2 select-none">
        {data.map((monthData, monthIdx) => {
          return (
            <div key={monthIdx} className="flex-1 min-w-[130px] border border-gray-100 dark:border-slate-800/50 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/20">
              <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 mb-3 block text-center">
                {monthData.monthName}
              </span>

              <div className="flex gap-1.5 justify-center">
                {/* Y-axis days indicators */}
                <div className="grid grid-rows-7 gap-1 text-[8px] font-bold text-gray-400 dark:text-gray-600 pr-1 select-none">
                  {daysOfWeek.map((day, dIdx) => (
                    <span key={day} className="h-2.5 flex items-center justify-end leading-none">
                      {dIdx % 2 === 0 ? day[0] : ''}
                    </span>
                  ))}
                </div>

                {/* Grid columns of weeks */}
                <div className="flex gap-1">
                  {monthData.weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="grid grid-rows-7 gap-1">
                      {week.map((dayInfo, dayIdx) => (
                        <div
                          key={dayIdx}
                          title={dayInfo ? `${dayInfo.count} activities on Day ${dayInfo.day}` : undefined}
                          className={`w-2.5 h-2.5 rounded-xs transition-colors duration-150 cursor-pointer ${
                            dayInfo ? getColorClass(dayInfo.count) : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
