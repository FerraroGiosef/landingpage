import AppBottomNav from './AppBottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100dvh', background: '#FDFBF7', position: 'relative', paddingBottom: 68 }}>
      {children}
      <AppBottomNav />
    </div>
  );
}
