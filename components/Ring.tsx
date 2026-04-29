'use client';

interface RingProps {
  green: number;
  amber: number;
  total: number;
  size?: number;
  label?: string;
}

export default function Ring({ green, amber, total, size = 52, label }: RingProps) {
  const r = size / 2 - size * 0.14;
  const sw = size * 0.14;
  const C = 2 * Math.PI * r;
  const safeTotal = total > 0 ? total : 1;
  const gLen = (green / safeTotal) * C;
  const aLen = (amber / safeTotal) * C;
  const greenColor = green >= 4 ? '#2D6045' : green >= 2 ? '#3A7050' : green === 1 ? '#C07000' : '#A83226';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {green > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={greenColor}
            strokeWidth={sw}
            strokeDasharray={`${gLen} ${C - gLen}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
        )}
        {amber > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#C07000"
            strokeWidth={sw}
            strokeDasharray={`${aLen} ${C - aLen}`}
            strokeDashoffset={-gLen}
            strokeLinecap="round"
          />
        )}
        {green === 0 && amber === 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#A83226"
            strokeWidth={sw}
            strokeDasharray={`${C * 0.15} ${C * 0.85}`}
            strokeLinecap="round"
          />
        )}
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ fontSize: size * 0.28, fontWeight: 800, color: greenColor, lineHeight: 1 }}
      >
        <span>{green}</span>
        {label && (
          <span style={{ fontSize: size * 0.16, fontWeight: 700, color: '#8A9890', marginTop: 1 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
