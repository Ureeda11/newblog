'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'reader' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Registration failed')
      setLoading(false)
    } else {
      router.push('/login')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.1) 0%, transparent 60%)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
            <Sparkles size={24} color="var(--accent)" />
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 900 }}>
              Ink<span style={{ color: 'var(--accent)' }}>AI</span>
            </span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Create your account</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 700 }}>Get Started</h2>

          {error && (
            <div style={{ background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#ff6584', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Name */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.4rem', display: 'block' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.4rem', display: 'block' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.4rem', display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" minLength={6}
                  style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.6rem', display: 'block' }}>I want to...</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { value: 'reader', label: '📖 Read Blogs' },
                  { value: 'author', label: '✍️ Write Blogs' },
                ].map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    style={{
                      padding: '0.75rem', borderRadius: 10, cursor: 'pointer',
                      border: `1px solid ${form.role === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                      background: form.role === opt.value ? 'rgba(108,99,255,0.15)' : 'transparent',
                      color: form.role === opt.value ? 'var(--accent)' : 'var(--muted)',
                      fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s',
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              background: loading ? 'var(--border)' : 'var(--accent)',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '0.85rem', fontSize: '0.95rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              marginTop: '0.5rem',
            }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--muted)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}