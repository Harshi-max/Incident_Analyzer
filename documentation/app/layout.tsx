import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Incident Analyzer | AI-Powered Incident Intelligence',
  description: 'Incident Analyzer correlates application errors, generates incidents, and uses AI-powered root cause analysis to help engineers understand production failures faster.',
  openGraph: {
    title: 'Incident Analyzer | AI-Powered Incident Intelligence',
    description: 'Technical documentation for Incident Analyzer.',
    type: 'website',
    url: 'https://incident-analyzer.vercel.app',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
