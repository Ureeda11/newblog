'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Tag, Heart, Clock, ArrowRight, Sparkles } from 'lucide-react'

interface Post {
  _id: string
  title: string
  excerpt: string
  slug: string
  coverImage: string
  tags: string[]
  likesCount: number
  createdAt: string
  author: { name: string; avatar: string }
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [search])

  async function fetchPosts() {
    setLoading(true)
    const res = await fetch(`/api/posts?search=${search}`)
    const data = await res.json()
    setPosts(data.posts || [])
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a0f 100%)',
        padding: '5rem 1.5rem 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 20, padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
            <Sparkles size={14} color="var(--accent)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>AI-Powered Writing Platform</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Stories Written with
            <span style={{ color: 'var(--accent)', display: 'block' }}>Intelligence</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Discover thought-provoking articles crafted by writers powered by AI
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 480, margin: '0 auto' }}>
            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setSearch(searchInput)}
              placeholder="Search articles..."
              style={{
                width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                borderRadius: 12, color: 'var(--text)', fontSize: '0.95rem', outline: 'none',
              }}
            />
            <button onClick={() => setSearch(searchInput)} style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'var(--accent)', border: 'none', borderRadius: 8,
              padding: '0.45rem 1rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem',
            }}>Search</button>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: 'var(--surface)', borderRadius: 16, height: 320, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <p style={{ fontSize: '1.2rem' }}>No posts found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'var(--surface)',
          border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 16, overflow: 'hidden',
          transition: 'all 0.3s ease',
          transform: hovered ? 'translateY(-4px)' : 'none',
          boxShadow: hovered ? '0 20px 40px rgba(108,99,255,0.15)' : 'none',
        }}>

        {/* Cover Image */}
        <div style={{ height: 180, background: post.coverImage ? `url(${post.coverImage}) center/cover` : 'linear-gradient(135deg, #1a1a2e, #16213e)', position: 'relative' }}>
          {!post.coverImage && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={32} color="rgba(108,99,255,0.4)" />
            </div>
          )}
        </div>

        <div style={{ padding: '1.3rem' }}>
          {/* Tags */}
          {post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '0.8rem' }}>
              {post.tags.slice(0, 2).map(tag => (
                <span key={tag} style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent)', padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.75rem' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text)', lineHeight: 1.4 }}>
            {post.title}
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            {post.excerpt.slice(0, 100)}...
          </p>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>
                {post.author?.name?.[0] || 'A'}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{post.author?.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--muted)' }}>
                <Heart size={13} /> {post.likesCount}
              </span>
              <ArrowRight size={16} color={hovered ? 'var(--accent)' : 'var(--muted)'} style={{ transition: 'color 0.2s' }} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}