'use client';

interface TopBarProps {
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  showSearch?: boolean;
}

export default function TopBar({ searchValue = '', onSearchChange, showSearch = true }: TopBarProps) {
  return (
    <div
      style={{
        background: '#1E2220',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '10px 16px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>📍</span>
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: 'rgba(168,216,176,0.55)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              Your Location
            </div>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: '#E8EAE5',
                lineHeight: 1.3,
                marginTop: 2,
              }}
            >
              Shoreditch, London ▾
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(232,234,229,0.1)',
              border: '1px solid rgba(232,234,229,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: 16 }}>🔔</span>
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                background: '#A8D8B0',
                borderRadius: '50%',
                border: '1.5px solid #1E2220',
              }}
            />
          </button>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2D3530, #1E2220)',
              border: '2px solid #A8D8B0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 800,
              color: '#A8D8B0',
              cursor: 'pointer',
            }}
          >
            G
          </div>
        </div>
      </div>

      {showSearch && (
        <div style={{ paddingBottom: 12 }}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search restaurants, areas…"
            style={{
              width: '100%',
              background: 'rgba(232,234,229,0.1)',
              border: '1px solid rgba(232,234,229,0.2)',
              borderRadius: 12,
              padding: '11px 14px',
              fontSize: 13,
              color: '#E8EAE5',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(168,216,176,0.55)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(232,234,229,0.2)')}
          />
        </div>
      )}
    </div>
  );
}
