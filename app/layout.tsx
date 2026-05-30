import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RoastMyCode — AI Senior Engineer Code Review',
  description: 'Paste your code or GitHub PR. Get brutally honest feedback from an AI senior engineer. Free.',
  openGraph: {
    title: 'RoastMyCode',
    description: 'Your code reviewed by a brutally honest AI senior engineer',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
