import React, { useEffect, useState, useMemo } from 'react';

/*
 * MatchScoreCard — Glassmorphism circular progress badge
 *
 * Weighted scoring formula displayed:
 *   FinalScore = (Skill_relevance × 0.7) + (Overlap × 0.2) + (Profile_boost × 0.1)
 *
 * Color thresholds:
 *   score ≥ 75  → Green  (High Match)
 *   score 40-74 → Orange (Moderate Match)
 *   score < 40  → Red    (Low Match)
 */

const MatchScoreCard = ({ score, label, breakdown, size = 'small', animationDelay = '0ms' }) => {
  // score prop: undefined/null → Calculating state; 0-100 → progress arc

  // ── ALL HOOKS at top (React rules of hooks) ──────────────────────────────────
  // Animate the arc from 0 → score on mount
  const [displayScore, setDisplayScore] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDisplayScore(score ?? 0), 120);
    return () => clearTimeout(t);
  }, [score]);

  // Per-instance unique IDs to avoid SVG defs collisions when many cards render
  const uid = useMemo(
    () => `msc-${Math.random().toString(36).slice(2, 8)}`,
    []
  );
  const gradId   = `${uid}-grad`;
  const glowId   = `${uid}-glow`;
  const shadowId = `${uid}-shadow`;

  // ── Size config ─────────────────────────────────────────────────────────────
  const sizeConfig = {
    small:  { svgSize: 74,  strokeWidth: 5.5, scoreFontSize: 15, labelFontSize: 9,  padding: '10px 12px' },
    medium: { svgSize: 96,  strokeWidth: 6,   scoreFontSize: 20, labelFontSize: 11, padding: '12px 14px' },
    large:  { svgSize: 136, strokeWidth: 7,   scoreFontSize: 30, labelFontSize: 13, padding: '16px 18px' },
  };
  const cfg    = sizeConfig[size] || sizeConfig.small;
  const center = cfg.svgSize / 2;
  const radius = center - cfg.strokeWidth - 3;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (displayScore / 100) * circ;

  // ── Theme by score — declared before any conditional returns (hooks rule) ────
  const theme = useMemo(() => {
    const s = score ?? 0;
    if (s >= 75) return {
      gradStart  : '#22c55e',
      gradEnd    : '#4ade80',
      glowColor  : 'rgba(34, 197, 94, 0.55)',
      glowSoft   : 'rgba(34, 197, 94, 0.12)',
      glowOuter  : 'rgba(34, 197, 94, 0.18)',
      textColor  : '#15803d',
      border     : 'rgba(34, 197, 94, 0.30)',
      bgTint     : 'rgba(34, 197, 94, 0.07)',
      label      : 'High Match',
      trackStroke: 'rgba(34, 197, 94, 0.12)',
    };
    if (s >= 40) return {
      gradStart  : '#f97316',
      gradEnd    : '#fbbf24',
      glowColor  : 'rgba(249, 115, 22, 0.55)',
      glowSoft   : 'rgba(249, 115, 22, 0.12)',
      glowOuter  : 'rgba(249, 115, 22, 0.18)',
      textColor  : '#c2410c',
      border     : 'rgba(249, 115, 22, 0.30)',
      bgTint     : 'rgba(249, 115, 22, 0.07)',
      label      : 'Moderate',
      trackStroke: 'rgba(249, 115, 22, 0.12)',
    };
    return {
      gradStart  : '#ef4444',
      gradEnd    : '#f87171',
      glowColor  : 'rgba(239, 68, 68, 0.55)',
      glowSoft   : 'rgba(239, 68, 68, 0.12)',
      glowOuter  : 'rgba(239, 68, 68, 0.18)',
      textColor  : '#b91c1c',
      border     : 'rgba(239, 68, 68, 0.30)',
      bgTint     : 'rgba(239, 68, 68, 0.07)',
      label      : 'Low Match',
      trackStroke: 'rgba(239, 68, 68, 0.12)',
    };
  }, [score]);

  // ── Calculating fallback — safe to early-return now (all hooks called) ───────
  if (score == null) {
    return (
      <div
        className="animate-bounce-in inline-flex flex-col items-center justify-center relative"
        title="Match score is being calculated…"
        style={{
          borderRadius        : '18px',
          padding             : cfg.padding,
          background          : 'rgba(255, 255, 255, 0.55)',
          backdropFilter      : 'blur(18px) saturate(200%)',
          WebkitBackdropFilter: 'blur(18px) saturate(200%)',
          border              : '1.5px solid rgba(156, 163, 175, 0.30)',
          boxShadow           : '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.70)',
          animationDelay,
        }}
      >
        {/* Spinning dot-ring */}
        <div
          style={{
            width          : cfg.svgSize,
            height         : cfg.svgSize,
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'center',
          }}
        >
          <div
            style={{
              width         : Math.round(cfg.svgSize * 0.52),
              height        : Math.round(cfg.svgSize * 0.52),
              borderRadius  : '50%',
              border        : `${cfg.strokeWidth}px solid rgba(209, 213, 219, 0.7)`,
              borderTopColor: 'rgba(107, 114, 128, 0.85)',
              /* reuse @keyframes spin from animations.css */
              animation     : 'spin 1.1s linear infinite',
            }}
          />
        </div>
        <p
          style={{
            marginTop    : '5px',
            fontSize     : cfg.labelFontSize,
            fontWeight   : 700,
            color        : '#9ca3af',
            letterSpacing: '0.3px',
            textAlign    : 'center',
            lineHeight   : 1,
          }}
        >
          Calculating
        </p>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div
      className="animate-bounce-in inline-flex flex-col items-center justify-center relative overflow-visible"
      style={{
        borderRadius        : '18px',
        padding             : cfg.padding,
        /* Glassmorphism */
        background          : 'rgba(255, 255, 255, 0.55)',
        backdropFilter      : 'blur(18px) saturate(200%)',
        WebkitBackdropFilter: 'blur(18px) saturate(200%)',
        border              : `1.5px solid ${theme.border}`,
        /* Layered 3D glow: tight ring → soft halo → wide outer bloom */
        boxShadow: `
          0 0 0 3px ${theme.glowSoft},
          0 4px 16px ${theme.glowSoft},
          0 8px 32px ${theme.glowOuter},
          0 1px 4px rgba(0,0,0,0.06),
          inset 0 1px 0 rgba(255,255,255,0.75)
        `,
        transition          : 'box-shadow 0.3s ease, transform 0.3s ease',
        animationDelay,
      }}
      onMouseEnter={e => {
        setShowTooltip(true);
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.06)';
        e.currentTarget.style.boxShadow = [
          `0 0 0 3px ${theme.border}`,
          `0 12px 40px ${theme.glowColor}`,
          `0 4px 16px ${theme.glowSoft}`,
          `0 2px 8px rgba(0,0,0,0.08)`,
          `inset 0 1px 0 rgba(255,255,255,0.75)`,
        ].join(', ');
      }}
      onMouseLeave={e => {
        setShowTooltip(false);
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = [
          `0 0 0 3px ${theme.glowSoft}`,
          `0 4px 16px ${theme.glowSoft}`,
          `0 8px 32px ${theme.glowOuter}`,
          `0 1px 4px rgba(0,0,0,0.06)`,
          `inset 0 1px 0 rgba(255,255,255,0.75)`,
        ].join(', ');
      }}
    >
      {/* ── Hover Tooltip — Formula Breakdown ─────────────────────────── */}
      {showTooltip && (
        <div
          style={{
            position            : 'absolute',
            bottom              : '100%',
            left                : '50%',
            transform           : 'translateX(-50%)',
            marginBottom        : '10px',
            zIndex              : 9999,
            minWidth            : '230px',
            padding             : '14px 16px',
            borderRadius        : '14px',
            background          : 'rgba(255, 255, 255, 0.82)',
            backdropFilter      : 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border              : `1px solid ${theme.border}`,
            boxShadow           : `0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px ${theme.glowSoft}`,
            pointerEvents       : 'none',
            animation           : 'fadeIn 0.18s ease-out',
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position   : 'absolute',
              bottom     : '-6px',
              left       : '50%',
              transform  : 'translateX(-50%) rotate(45deg)',
              width      : '12px',
              height     : '12px',
              background : 'rgba(255, 255, 255, 0.82)',
              border     : `1px solid ${theme.border}`,
              borderTop  : 'none',
              borderLeft : 'none',
            }}
          />

          {/* Title */}
          <p style={{ fontSize: '11px', fontWeight: 800, color: theme.textColor, marginBottom: '8px', letterSpacing: '0.3px' }}>
            Score Breakdown
          </p>

          {/* Formula */}
          <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '10px', fontFamily: 'monospace', lineHeight: 1.5, background: 'rgba(0,0,0,0.03)', borderRadius: '6px', padding: '6px 8px' }}>
            Final = (S<sub>r</sub>×0.7) + (S<sub>o</sub>×0.2) + (P<sub>b</sub>×0.1)
          </p>

          {/* Breakdown rows */}
          {[
            { key: 'Sr', label: 'Required Skill Match', value: breakdown?.Sr },
            { key: 'So', label: 'Skill Overlap',        value: breakdown?.So },
            { key: 'Pb', label: 'Profile Boost',        value: breakdown?.Pb },
          ].map(row => (
            <div key={row.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', color: '#374151', fontWeight: 500 }}>
                {row.label} <span style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '10px' }}>({row.key})</span>
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: theme.textColor, minWidth: '36px', textAlign: 'right' }}>
                {row.value != null ? `${row.value}%` : '—'}
              </span>
            </div>
          ))}

          {/* Divider + final */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '6px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151' }}>Final Score</span>
            <span style={{ fontSize: '13px', fontWeight: 900, color: theme.textColor }}>{Math.round(score)}%</span>
          </div>
        </div>
      )}
      {/* Soft color tint wash */}
      <div
        aria-hidden="true"
        style={{
          position       : 'absolute',
          inset          : 0,
          borderRadius   : '18px',
          background     : theme.bgTint,
          pointerEvents  : 'none',
        }}
      />

      {/* ── SVG Circular Progress ─────────────────────────────────────── */}
      <div style={{ position: 'relative', width: cfg.svgSize, height: cfg.svgSize }}>
        <svg
          width={cfg.svgSize}
          height={cfg.svgSize}
          viewBox={`0 0 ${cfg.svgSize} ${cfg.svgSize}`}
          style={{ transform: 'rotate(-90deg)', display: 'block' }}
          aria-hidden="true"
        >
          <defs>
            {/* Gradient stroke for the progress arc */}
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor={theme.gradStart} />
              <stop offset="100%" stopColor={theme.gradEnd}   />
            </linearGradient>

            {/* Soft glow blur filter */}
            <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blurred" />
            </filter>

            {/* Drop-shadow filter — deeper stdDeviation + slight y-offset for 3D lift */}
            <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={theme.gradStart} floodOpacity="0.45" />
            </filter>
          </defs>

          {/* ① Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={theme.trackStroke}
            strokeWidth={cfg.strokeWidth}
          />

          {/* ② Glow halo (blurred, rendered behind main arc) */}
          {displayScore > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={theme.gradStart}
              strokeWidth={cfg.strokeWidth + 3}
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              filter={`url(#${glowId})`}
              opacity={0.40}
              style={{
                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          )}

          {/* ③ Main progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={cfg.strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter={`url(#${shadowId})`}
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </svg>

        {/* ── Center label ──────────────────────────────────────────── */}
        <div
          style={{
            position       : 'absolute',
            inset          : 0,
            display        : 'flex',
            flexDirection  : 'column',
            alignItems     : 'center',
            justifyContent : 'center',
            gap            : '1px',
          }}
        >
          <span
            style={{
              fontSize  : cfg.scoreFontSize,
              fontWeight: 900,
              color     : theme.textColor,
              lineHeight: 1,
              letterSpacing: '-0.5px',
            }}
          >
            {Math.round(score)}%
          </span>
        </div>
      </div>

      {/* ── Score label ───────────────────────────────────────────────── */}
      <p
        style={{
          marginTop  : '5px',
          fontSize   : cfg.labelFontSize,
          fontWeight : 700,
          color      : theme.textColor,
          letterSpacing: '0.3px',
          textAlign  : 'center',
          lineHeight : 1,
          position   : 'relative', // above the tint layer
        }}
      >
        {label || theme.label}
      </p>
    </div>
  );
};

export default MatchScoreCard;
