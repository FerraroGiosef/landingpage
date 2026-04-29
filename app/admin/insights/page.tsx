'use client';

const WEEKLY_VIEWS = [
  { day: 'Mon', views: 140 },
  { day: 'Tue', views: 185 },
  { day: 'Wed', views: 210 },
  { day: 'Thu', views: 175 },
  { day: 'Fri', views: 290 },
  { day: 'Sat', views: 320 },
  { day: 'Sun', views: 260 },
];

const TOP_DISHES = [
  { name: 'Risotto ai Funghi Selvatici', views: 312, tags: ['Vegan', 'GF'] },
  { name: 'Bruschetta al Pomodoro', views: 278, tags: ['Vegan'] },
  { name: 'Tiramisù della Casa', views: 241, tags: ['Vegetarian'] },
  { name: 'Branzino in Crosta di Erbe', views: 198, tags: ['GF'] },
  { name: 'Melanzane alla Parmigiana', views: 167, tags: ['Vegetarian'] },
];

const FILTER_STATS = [
  { label: 'Gluten-free', count: 489 },
  { label: 'Vegan', count: 412 },
  { label: 'Dairy-free', count: 367 },
  { label: 'Nut-free', count: 201 },
  { label: 'Vegetarian', count: 188 },
];

const maxViews = Math.max(...WEEKLY_VIEWS.map((d) => d.views));

export default function InsightsPage() {
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', borderBottom: '0.5px solid #C4B9A8' }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 400, color: '#1A1614', margin: 0 }}>Insights</h1>
          <p style={{ fontSize: 11, color: '#8B7E71', margin: '4px 0 0' }}>Last 7 days · Updated 22 Apr 2026</p>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* KPI strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { value: '1,580', label: 'Total views', change: '+14%' },
            { value: '342', label: 'Unique diners', change: '+8%' },
            { value: '4.2', label: 'Avg. dishes viewed', change: '+0.3' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#F5F0E8', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#1A1614', marginBottom: 2 }}>{stat.value}</div>
              <div style={{ fontSize: 9.5, color: '#8B7E71', marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 9.5, color: '#3A6B0A', background: '#EDF6E2', borderRadius: 100, padding: '1px 6px', display: 'inline-block' }}>{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Menu page views</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
            {WEEKLY_VIEWS.map((d) => {
              const pct = (d.views / maxViews) * 100;
              const isToday = d.day === 'Wed';
              return (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${pct}%`,
                      background: isToday ? '#1A1614' : '#C4B9A8',
                      borderRadius: '4px 4px 0 0',
                      minHeight: 4,
                      transition: 'height 0.3s',
                    }}
                  />
                  <span style={{ fontSize: 9, color: isToday ? '#1A1614' : '#8B7E71', fontWeight: isToday ? 500 : 400 }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top dishes */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Most viewed dishes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOP_DISHES.map((dish, i) => (
              <div key={dish.name} style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, padding: '12px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#C4B9A8', width: 20, textAlign: 'center', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#1A1614', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dish.name}</div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {dish.tags.map((tag) => (
                      <span key={tag} style={{ background: '#EDF6E2', color: '#3A6B0A', borderRadius: 100, padding: '1px 7px', fontSize: 9.5 }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#1A1614', fontWeight: 500, flexShrink: 0 }}>{dish.views}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top filters */}
        <div>
          <div style={{ fontSize: 11, color: '#8B7E71', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Top allergen filters used</div>
          <div style={{ background: '#FFFFFF', border: '0.5px solid #C4B9A8', borderRadius: 12, overflow: 'hidden' }}>
            {FILTER_STATS.map((f, i) => {
              const pct = Math.round((f.count / FILTER_STATS[0].count) * 100);
              return (
                <div
                  key={f.label}
                  style={{
                    padding: '12px',
                    borderBottom: i < FILTER_STATS.length - 1 ? '0.5px solid #F5F0E8' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 12, color: '#1A1614', width: 90, flexShrink: 0 }}>{f.label}</div>
                  <div style={{ flex: 1, background: '#F5F0E8', borderRadius: 100, height: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#1A1614', borderRadius: 100 }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#8B7E71', width: 32, textAlign: 'right', flexShrink: 0 }}>{f.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
