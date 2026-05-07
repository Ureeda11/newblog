import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from '@/components/SessionProvider'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'InkAI — AI Powered Blog Platform',
  description: 'Write beautiful blogs with the power of AI',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}