'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { PenLine, LogOut, LayoutDashboard, Menu, X, Sparkles } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={22} color="var(--accent)" />
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)' }}>
            Ink<span style={{ color: 'var(--accent)' }}>AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
            Blog
          </Link>

          {session ? (
            <>
              {session.user.role === 'author' && (
                <>
                  <Link href="/dashboard" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <Link href="/dashboard/new" style={{
                    background: 'var(--accent)', color: '#fff', padding: '0.45rem 1rem',
                    borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem',
                    display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500,
                  }}>
                    <PenLine size={15} /> Write
                  </Link>
                </>
              )}
              <button onClick={() => signOut()} style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--muted)', padding: '0.45rem 1rem', borderRadius: 8,
                cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
              <Link href="/register" style={{
                background: 'var(--accent)', color: '#fff', padding: '0.45rem 1.2rem',
                borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500,
              }}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}