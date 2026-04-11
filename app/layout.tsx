import './globals.css';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  // SEO DASAR
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: 'The most advanced and secure Telegram Bot for URL shortening and link management. Fast, automated, and built for creators.',
  keywords: ['URL Shortener', 'Telegram Bot', 'Secure Link', 'Safelink', 'Link Management'],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,

  // OPEN GRAPH (Facebook, WhatsApp, Discord)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tele-link-eight.vercel.app/', // Ganti dengan domain asli lu nanti
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: 'Simplify your links with our professional Telegram Bot. Secure, fast, and easy to monetize.',
    images: [
      {
        url: 'https://tele-link-eight.vercel.app/og-image.jpg', // Pastikan file ini ada di folder public
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  // TWITTER CARD
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: 'Transform long URLs into secure, manageable short links instantly via Telegram.',
    images: ['https://tele-link-eight.vercel.app/og-image.jpg'], // Samakan dengan OG Image
  },

  // ICONS (Favicon)
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },

  // ROBOTS (Biar di-index Google)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[#121212] selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
