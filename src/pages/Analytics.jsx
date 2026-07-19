import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import {
  Users,
  Percent,
  Hourglass,
  AlertCircle,
  TrendingUp,
  IndianRupee,
  Calendar,
  Sparkles
} from 'lucide-react';


// Analytics components
import PieChartCard from '../components/analytics/PieChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import AreaChartCard from '../components/analytics/AreaChartCard';
import HorizontalBarChartCard from '../components/analytics/HorizontalBarChartCard';
import SalesFunnelCard from '../components/analytics/SalesFunnelCard';
import ActivityHeatmapCard from '../components/analytics/ActivityHeatmapCard';

// Transformation helpers
import {
  getAugmentedLeads,
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueTrend,
  getLeadSources,
  getAvgTimeToClose,
  getSalesFunnel,
  getTopPerformers,
  getActivityHeatmap
} from '../utils/analyticsHelpers';

export default function Analytics() {
  const { leads, setIsAddLeadOpen } = useLeads();
  const [dateRange, setDateRange] = useState('This Year');

  // Augment leads context with deterministic mock records to achieve 100-lead analytics dashboard
  const rawAugmentedLeads = getAugmentedLeads(leads);

  // Date range filtering helper
  const filterLeadsByRange = (leadsList, range) => {
    const now = new Date();
    let cutOffDate = new Date();
    
    if (range === '7 Days') {
      cutOffDate.setDate(now.getDate() - 7);
    } else if (range === '30 Days') {
      cutOffDate.setDate(now.getDate() - 30);
    } else if (range === '90 Days') {
      cutOffDate.setDate(now.getDate() - 90);
    } else {
      // This Year: Jan 1st of current year (e.g. 2026)
      cutOffDate = new Date(now.getFullYear(), 0, 1);
    }
    
    return leadsList.filter(lead => {
      const d = new Date(lead.createdAt);
      return d >= cutOffDate;
    });
  };

  const filteredLeads = filterLeadsByRange(rawAugmentedLeads, dateRange);

  // Metrics calculations
  const totalLeads = filteredLeads.length;
  const wonLeads = filteredLeads.filter(l => l.status === 'Won');
  const wonCount = wonLeads.length;
  const lostCount = filteredLeads.filter(l => l.status === 'Lost').length;

  const wonRate = totalLeads > 0 ? Math.round((wonCount / totalLeads) * 100) : 0;
  const lostRate = totalLeads > 0 ? Math.round((lostCount / totalLeads) * 100) : 0;

  // Pipeline stages: New, Contacted, Meeting Scheduled, Proposal Sent
  const pipelineLeads = filteredLeads.filter(
    l => l.status !== 'Won' && l.status !== 'Lost'
  );
  const pipelineValue = pipelineLeads.reduce((sum, l) => sum + (l.value || 0), 0);
  const wonRevenue = wonLeads.reduce((sum, l) => sum + (l.value || 0), 0);

  const avgTimeToClose = getAvgTimeToClose(filteredLeads);

  // Formatting helpers
  const formatCurrency = (val) => {
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  // Additional advanced calculations for forecast and daily velocity
  // Sales Velocity = Won Revenue / 30 (daily rate over approx month)
  const salesVelocity = Math.round(wonRevenue / 30);

  // Weighted Forecast based on pipeline stages probabilities
  const revenueForecast = Math.round(
    pipelineLeads.reduce((sum, lead) => {
      let probability = 0.1; // Default New: 10%
      if (lead.status === 'Contacted') probability = 0.2;
      else if (lead.status === 'Meeting Scheduled') probability = 0.4;
      else if (lead.status === 'Proposal Sent') probability = 0.7;
      return sum + (lead.value || 0) * probability;
    }, 0)
  );

  // Transform data structures for charts
  const statusData = getStatusDistribution(filteredLeads);
  const monthlyData = getMonthlyLeads(filteredLeads);
  const conversionData = getConversionByMonth(filteredLeads);
  const revenueData = getRevenueTrend(filteredLeads);
  const sourceData = getLeadSources(filteredLeads);
  const funnelData = getSalesFunnel(filteredLeads);
  const performerData = getTopPerformers(filteredLeads);
  const heatmapData = getActivityHeatmap(filteredLeads);

  // Date range filters configuration
  const ranges = ['7 Days', '30 Days', '90 Days', 'This Year'];

  // Metrics configuration list
  const metrics = [
    {
      title: 'Total Leads',
      value: totalLeads.toLocaleString(),
      subtitle: 'Active pipeline',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/15',
    },
    {
      title: 'Conversion Rate',
      value: `${wonRate}%`,
      subtitle: 'Won vs total',
      icon: Percent,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/15',
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(pipelineValue),
      subtitle: 'Open opportunities',
      icon: TrendingUp,
      color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/15',
    },
    {
      title: 'Won Revenue',
      value: formatCurrency(wonRevenue),
      subtitle: 'Revenue closed',
      icon: IndianRupee,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/15',
    },
    {
      title: 'Average Sales Cycle',
      value: totalLeads > 0 && wonCount > 0 ? `${avgTimeToClose} Days` : '—',
      subtitle: 'First contact to win',
      icon: Hourglass,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/15',
    },
    {
      title: 'Lost Rate',
      value: `${lostRate}%`,
      subtitle: 'Lost opportunities',
      icon: AlertCircle,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/15',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Header with quick filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track sales performance, conversion health, and growth trends.
          </p>
        </div>

        {/* Date pills */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-slate-800 rounded-lg shrink-0">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                dateRange === range
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {totalLeads === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 animate-bounce">
            <TrendingUp size={22} />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">No Analytics Data Available</h2>
          <p className="text-xs text-slate-400 dark:text-gray-400 max-w-sm mt-1 mb-6">
            We need at least one lead registered in the pipeline to formulate metrics, monthly volume, and conversion trend statistics.
          </p>
          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Create Lead
          </button>
        </div>
      ) : (
        <>
          {/* Top Metric Cards - 6 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {metrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div
                  key={idx}
                  className="p-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      {metric.title}
                    </span>
                    <div className={`p-1.5 rounded-lg border ${metric.color}`}>
                      <Icon size={14} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      {metric.value}
                    </span>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium">{metric.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donut Distribution & Bar Counts */}
            <div className="h-full">
              <PieChartCard data={statusData} />
            </div>
            <div className="h-full">
              <BarChartCard data={monthlyData} />
            </div>
          </div>

          {/* Wide Conversion Trend Line Chart */}
          <div className="w-full">
            <LineChartCard data={conversionData} />
          </div>

          {/* Revenue Trend Area Chart & Lead Sources Horizontal Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-full">
              <AreaChartCard data={revenueData} />
            </div>
            <div className="h-full">
              <HorizontalBarChartCard data={sourceData} />
            </div>
          </div>

          {/* Sales Velocity & Revenue Forecast Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Velocity */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Sales Velocity
                </span>
                <h3 className="text-2xl font-black text-emerald-500 tracking-tight">
                  {formatCurrency(salesVelocity)}
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Estimated revenue generation rate per day</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl border border-emerald-100 dark:border-emerald-900/15 shrink-0">
                <Sparkles size={20} />
              </div>
            </div>

            {/* Revenue Forecast */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Revenue Forecast
                </span>
                <h3 className="text-2xl font-black text-blue-500 dark:text-blue-400 tracking-tight">
                  {formatCurrency(revenueForecast)}
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Weighted pipeline projection for next period</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/15 shrink-0">
                <Calendar size={20} />
              </div>
            </div>
          </div>

          {/* Sales Funnel & Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-full">
              <SalesFunnelCard data={funnelData} />
            </div>

            {/* Top Performers Card */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Top Performers</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Won revenue values grouped by sales owner</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center space-y-4">
                {performerData.length === 0 ? (
                  <span className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">
                    No closed won deals recorded
                  </span>
                ) : (
                  performerData.map((performer, idx) => (
                    <div
                      key={performer.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 dark:bg-slate-900/30 border border-gray-100 dark:border-slate-800/40 hover:border-gray-200 dark:hover:border-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Rank Circle */}
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-gray-600 dark:text-gray-400">
                          {idx + 1}
                        </div>
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white bg-blue-600 select-none">
                          {performer.name[0]}
                        </div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {performer.name}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-gray-900 dark:text-white">
                        {formatCurrency(performer.value)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Activity Heatmap Grid */}
          <div className="w-full">
            <ActivityHeatmapCard data={heatmapData} />
          </div>
        </>
      )}
    </div>
  );
}
