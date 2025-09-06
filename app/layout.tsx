import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Verba AI - HIPAA-Compliant Clinical Documentation',
  description: 'Transform your clinical documentation with AI-powered notes. HIPAA-compliant, objective, behaviorally anchored notes from recorded sessions. Get 50% off early access.',
  keywords: 'clinical documentation, therapy notes, SOAP notes, DAP notes, BIRP notes, HIPAA compliant, mental health software, EHR integration',
  authors: [{ name: 'Verba AI' }],
  openGraph: {
    title: 'Verba AI - AI-Powered Clinical Documentation',
    description: 'Save hours on clinical documentation. Get 50% off early access - launching October 2024',
    url: 'https://verba-ai.com',
    siteName: 'Verba AI',
    images: [
      {
        url: 'https://verba-ai.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verba AI - Clinical Documentation Made Simple',
    description: 'Transform your practice with AI-powered clinical notes. 50% off early access.',
    images: ['https://verba-ai.com/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}