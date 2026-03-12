import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import API from '../../utils/api';
import { FiAward, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';

/* ─── Glassmorphism card style ─────────────────────────────────────────── */
const glassCard = {
  background: 'rgba(255, 255, 255, 0.72)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.55)',
  borderRadius: '20px',
  boxShadow:
    '0 8px 32px rgba(31, 38, 135, 0.08), 0 2px 8px rgba(0,0,0,0.04)',
  padding: '24px',
};

/* ─── Custom Recharts tooltips ─────────────────────────────────────────── */
const tooltipCard = {
  background: 'rgba(255, 255, 255, 0.97)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  borderRadius: '12px',
  padding: '10px 16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, color } = payload[0].payload;
  return (
    <div style={tooltipCard}>
      <p style={{ fontWeight: 700, color, margin: 0, fontSize: 13 }}>{name}</p>
      <p style={{ color: '#374151', margin: '3px 0 0', fontSize: 13 }}>
        {value} application{value !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipCard}>
      <p style={{ fontWeight: 700, color: '#374151', margin: 0, fontSize: 13 }}>
        Score: {label}%
      </p>
      <p style={{ color: '#6b7280', margin: '3px 0 0', fontSize: 13 }}>
        {payload[0].value} application{payload[0].value !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

/* ─── Inline percentage label inside pie slices ────────────────────────── */
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ─── Empty state placeholder ─────────────────────────────────────── */
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 240,
      color: '#9ca3af',
    }}
  >
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'rgba(107,114,128,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
      }}
    >
      <Icon size={28} />
    </div>
    <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{title}</p>
    <p style={{ fontSize: 12, marginTop: 4 }}>{subtitle}</p>
  </div>
);

/* ─── Loading skeleton ─────────────────────────────────────────────── */
const AnalyticsSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-6 mb-8">
    {[0, 1].map((i) => (
      <div key={i} style={glassCard}>
        <div className="skeleton h-6 w-40 mb-2 rounded-lg" />
        <div className="skeleton h-4 w-24 mb-6 rounded-lg" />
        <div className="skeleton rounded-xl" style={{ height: 240 }} />
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════
   StudentAnalytics
   Props:
     applications — array from getStudentApplications (already fetched by
                    StudentDashboard), each item has a `matchScore` number
   ══════════════════════════════════════════════════════════════════════════ */
const StudentAnalytics = ({ applications }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics/student')
      .then((res) => setAnalyticsData(res.data))
      .catch((err) => console.error('Analytics fetch:', err))
      .finally(() => setLoading(false));
  }, []);

  /* ── Match score distribution bucketed from props ── */
  const scoreBuckets = [
    { range: '0–25',  color: '#ef4444', gradId: 'barG0' },
    { range: '26–50', color: '#f59e0b', gradId: 'barG1' },
    { range: '51–75', color: '#3b82f6', gradId: 'barG2' },
    { range: '76–100',color: '#10b981', gradId: 'barG3' },
  ].map((bucket) => {
    const [min, max] = bucket.range.split('–').map(Number);
    const count = applications.filter((app) => {
      const s = app.matchScore ?? 0;
      return s >= min && s <= max;
    }).length;
    return { ...bucket, count };
  });

  const statusData = analyticsData?.statusBreakdown ?? [
    { name: 'Pending',  value: 0, color: '#f59e0b' },
    { name: 'Accepted', value: 0, color: '#10b981' },
    { name: 'Rejected', value: 0, color: '#ef4444' },
  ];
  const avgScore = analyticsData?.averageMatchScore ?? 0;
  const hasApps = applications.length > 0;

  /* ── Avg score badge colour ── */
  const avgColor =
    avgScore >= 76 ? '#10b981' :
    avgScore >= 51 ? '#3b82f6' :
    avgScore >= 26 ? '#f59e0b' : '#ef4444';

  if (loading) return <AnalyticsSkeleton />;

  return (
    <div className="mb-8">
      {/* ── Section Header ─────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 mb-6 animate-slide-down"
        style={{ animationDelay: '0.05s' }}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
          <p className="text-gray-500 text-sm mt-1">
            Visual insights into your application performance
          </p>
        </div>

        {/* Avg score pill */}
        <div
          style={{
            background: `linear-gradient(135deg, ${avgColor}22, ${avgColor}11)`,
            border: `1px solid ${avgColor}44`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '12px',
            padding: '8px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FiAward style={{ color: avgColor, flexShrink: 0 }} size={16} />
          <span style={{ fontWeight: 700, color: avgColor, fontSize: '13px', whiteSpace: 'nowrap' }}>
            Avg Match Score: {avgScore}%
          </span>
        </div>
      </div>

      {/* ── Charts Grid ────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* ① PIE CHART — Application Status Distribution */}
        <div
          style={{ ...glassCard, animationDelay: '0.1s' }}
          className="animate-slide-in-left"
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <FiTrendingUp style={{ color: 'white' }} size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Application Status</h3>
              <p className="text-gray-500 text-xs">
                {applications.length} total application{applications.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {!hasApps ? (
            <EmptyState
              icon={FiTrendingUp}
              title="No applications yet"
              subtitle="Start applying to see your stats here"
            />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={false}
                  label={renderPieLabel}
                  isAnimationActive
                  animationBegin={100}
                  animationDuration={800}
                >
                  {statusData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                  formatter={(value, entry) => (
                    <span style={{ color: '#374151', fontWeight: 600 }}>
                      {value}&nbsp;
                      <span style={{ color: '#6b7280', fontWeight: 400 }}>
                        ({entry.payload.value})
                      </span>
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ② BAR CHART — Match Score Distribution */}
        <div
          style={{ ...glassCard, animationDelay: '0.2s' }}
          className="animate-slide-in-right"
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <FiBarChart2 style={{ color: 'white' }} size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Match Score Distribution</h3>
              <p className="text-gray-500 text-xs">
                Applications grouped by match strength
              </p>
            </div>
          </div>

          {!hasApps ? (
            <EmptyState
              icon={FiBarChart2}
              title="No applications yet"
              subtitle="Apply to projects to track your match scores"
            />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={scoreBuckets}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                barSize={44}
              >
                <defs>
                  {scoreBuckets.map((b) => (
                    <linearGradient key={b.gradId} id={b.gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={b.color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={b.color} stopOpacity={0.5} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(107,114,128,0.15)"
                  vertical={false}
                />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomBarTooltip />}
                  cursor={{ fill: 'rgba(107,114,128,0.06)', radius: 8 }}
                />
                <Bar
                  dataKey="count"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive
                  animationBegin={150}
                  animationDuration={700}
                >
                  {scoreBuckets.map((b) => (
                    <Cell key={b.gradId} fill={`url(#${b.gradId})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
