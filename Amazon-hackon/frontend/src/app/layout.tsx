import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import LayoutShell from '@/components/layout/LayoutShell'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Intelligent Bridge | Amazon Reverse Logistics',
  description: 'AI-powered returns grading, smart routing, fraud detection, and marketplace matching platform for Amazon reverse logistics. Built for Amazon Hackathon 2026.',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  )
}
