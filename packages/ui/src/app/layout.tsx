import './globals.css';
import { Quicksand, Roboto } from 'next/font/google'
import type { Metadata } from 'next';
import type React from 'react'

const roboto = Roboto({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '700']
})

const quicksand = Quicksand({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '700']
})

export const metadata: Metadata = {
  title: 'jGames',
  description: 'The best family game app in the universe',
};

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={`${roboto.className} ${quicksand.className} antialiased`}>
      <body>
        {children}
      </body>
    </html>
  );
}
