import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Topbar from '@/components/layout/Topbar'
import Sidebar from '@/components/layout/Sidebar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Intelligent Bridge | Amazon Reverse Logistics',
  description: 'AI-powered returns grading, smart routing, fraud detection, and marketplace matching platform for Amazon reverse logistics. Built for Amazon Hackathon 2026.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Topbar />
          <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <main style={{
              flex: 1,
              padding: '24px',
              background: '#0f1111',
              overflowY: 'auto',
              minHeight: 'calc(100vh - 50px)',
            }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
