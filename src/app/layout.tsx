import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "BharatRide | India's Smart Cab, Auto & Bike Taxi Booking App",
  description:
    'Book Auto Rickshaw, Bike Taxi, Mini & Prime Cabs across Bengaluru, Mumbai, Delhi NCR, and Hyderabad with instant UPI payments, live GPS tracking, and 112 emergency safety.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
