import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PlateMatch — Find dishes you can actually eat',
  description: 'Search restaurants by your allergens. See compatible dishes before you go. Verified by the restaurant.',
  manifest: '/manifest.json',
  themeColor: '#1A1614',
  viewport: 'width=device-width, initial-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PlateMatch',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#FDFBF7' }}>
        {children}
      </body>
    </html>
  );
}
