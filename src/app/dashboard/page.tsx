'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { PenLine, Eye, Heart, FileText, Plus, Trash2, Edit, Globe, Lock } from 'lucide-react'

interface Post {
  _id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  likesCount: number
  createdAt: string
  tags: string[]
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    const res = await fetch('/api/dashboard/posts')
    const data = await res.json()
    setPosts(data.posts || [])
    setLoading(false)
  }

  async function handleDelete(slug: string) {
    if (!confirm('Delete this post?')) return
    setDeleting(slug)
    await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
    setPosts(posts.filter(p => p.slug !== slug))
    setDeleting(null)
  }

  const published = posts.filter(p => p.status === 'published').length
  const drafts = posts.filter(p => p.status === 'draft').length
  const totalLikes = posts.reduce((sum, p) => sum + p.likesCount, 0)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.25rem' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Welcome back, {session?.user.name} ✨
          </p>
        </div>
        <Link href="/dashboard/new" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--accent)', color: '#fff', textDecoration: 'none',
          padding: '0.7rem 1.3rem', borderRadius: 12, fontWeight: 500, fontSize: '0.9rem',
        }}>
          <Plus size={18} /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Posts', value: posts.length, icon: <FileText size={20} />, color: '#6c63ff' },
          { label: 'Published', value: published, icon: <Globe size={20} />, color: '#22c55e' },
          { label: 'Drafts', value: drafts, icon: <Lock size={20} />, color: '#f5c842' },
          { label: 'Total Likes', value: totalLikes, icon: <Heart size={20} />, color: '#ff6584' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '1.3rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Playfair Display, serif' }}>{stat.value}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Posts Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <PenLine size={18} color="var(--accent)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Your Posts</h2>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>No posts yet</p>
            <Link href="/dashboard/new" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
              Write your first post →
            </Link>
          </div>
        ) : (
          <div>
            {posts.map((post, i) => (
              <div key={post._id} style={{
                padding: '1.1rem 1.5rem',
                borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '1rem', flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.3rem' }}>
                    <span style={{
                      fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: 6, fontWeight: 500,
                      background: post.status === 'published' ? 'rgba(34,197,94,0.15)' : 'rgba(245,200,66,0.15)',
                      color: post.status === 'published' ? '#22c55e' : '#f5c842',
                    }}>
                      {post.status === 'published' ? '● Published' : '○ Draft'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>{post.title}</h3>
                  <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                    {new Date(post.createdAt).toLocaleDateString()} · {post.likesCount} likes
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {post.status === 'published' && (
                    <Link href={`/blog/${post.slug}`} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: 'transparent', border: '1px solid var(--border)',
                      color: 'var(--muted)', padding: '0.45rem 0.9rem',
                      borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem',
                    }}>
                      <Eye size={14} /> View
                    </Link>
                  )}
                  <Link href={`/dashboard/edit/${post.slug}`} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)',
                    color: 'var(--accent)', padding: '0.45rem 0.9rem',
                    borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem',
                  }}>
                    <Edit size={14} /> Edit
                  </Link>
                  <button onClick={() => handleDelete(post.slug)} disabled={deleting === post.slug} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)',
                    color: '#ff6584', padding: '0.45rem 0.9rem',
                    borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem',
                  }}>
                    <Trash2 size={14} /> {deleting === post.slug ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}