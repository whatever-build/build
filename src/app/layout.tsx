import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ai Crypto - Digital Asset Recovery',
  description: 'High-performance cryptographic engine and digital asset recovery platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-[#0a0a0a] min-h-screen">
        {children}
      </body>
    </html>
  );
}
