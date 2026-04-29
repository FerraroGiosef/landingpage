'use client';

interface ProgressBarProps {
  green: number;
  amber: number;
  total: number;
}

export default function ProgressBar({ green, amber, total }: ProgressBarProps) {
  const safeTotal = total > 0 ? total : 1;
  const gPct = (green / safeTotal) * 100;
  const aPct = (amber / safeTotal) * 100;
  const greenColor = green >= 4 ? '#2D6045' : green >= 2 ? '#3A7050' : green === 1 ? '#C07000' : '#A83226';

  return (
    <div className="w-full" style={{ height: 6, borderRadius: 100, overflow: 'hidden', background: 'transparent', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${gPct}%`,
          background: greenColor,
          borderRadius: '100px 0 0 100px',
          transition: 'width 0.4s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${gPct}%`,
          top: 0,
          height: '100%',
          width: `${aPct}%`,
          background: '#C07000',
          borderRadius: gPct === 0 ? '100px 0 0 100px' : '0',
          transition: 'width 0.4s ease, left 0.4s ease',
        }}
      />
    </div>
  );
}
