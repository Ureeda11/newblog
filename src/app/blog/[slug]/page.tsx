'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Heart, ArrowLeft, Send } from 'lucide-react'

interface Post {
  _id: string
  title: string
  content: string
  excerpt: string
  coverImage: string
  tags: string[]
  likesCount: number
  likes: string[]
  createdAt: string
  author: { name: string; avatar: string; bio: string }
}

interface Comment {
  _id: string
  content: string
  createdAt: string
  author: { name: string; avatar: string }
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const { data: session } = useSession()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [comment, setComment] = useState('')
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchPost()
      fetchComments()
    }
  }, [slug])

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/${slug}`)
      const data = await res.json()
      if (data.post) {
        setPost(data.post)
        setLikesCount(data.post?.likesCount || 0)
        if (session && data.post?.likes?.includes(session.user.id)) {
          setLiked(true)
        }
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  async function fetchComments() {
    try {
      const res = await fetch(`/api/posts/${slug}/comments`)
      const data = await res.json()
      setComments(data.comments || [])
    } catch (err) {
      console.error(err)
    }
  }

  async function handleLike() {
    if (!session) return
    const res = await fetch(`/api/posts/${slug}/like`, { method: 'POST' })
    const data = await res.json()
    setLiked(data.liked)
    setLikesCount(data.likesCount)
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim() || !session) return
    setSubmitting(true)
    const res = await fetch(`/api/posts/${slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: comment }),
    })
    const data = await res.json()
    if (res.ok) {
      setComments([data.comment, ...comments])
      setComment('')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--muted)' }}>Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ color: 'var(--muted)', fontSize: '1.2rem' }}>Post not found</div>
        <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Back to Home</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem' }}>

      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Blog
      </Link>

      {post.coverImage && (
        <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: '2rem', height: 380 }}>
          <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {post.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent)', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8rem' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '1.5rem' }}>
        {post.title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
            {post.author?.name?.[0]}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{post.author?.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
              {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        <button
          onClick={handleLike}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: liked ? 'rgba(255,101,132,0.15)' : 'var(--surface)',
            border: `1px solid ${liked ? 'rgba(255,101,132,0.4)' : 'var(--border)'}`,
            borderRadius: 10, padding: '0.5rem 1rem',
            cursor: session ? 'pointer' : 'default',
            color: liked ? '#ff6584' : 'var(--muted)',
            fontSize: '0.875rem', transition: 'all 0.2s',
          }}
        >
          <Heart size={16} fill={liked ? '#ff6584' : 'none'} />
          {likesCount}
        </button>
      </div>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{ marginBottom: '3rem' }}
      />

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>
          Comments ({comments.length})
        </h3>

        {session ? (
          <form onSubmit={handleComment} style={{ marginBottom: '2rem' }}>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              style={{
                width: '100%', padding: '0.9rem 1rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, color: 'var(--text)', fontSize: '0.9rem',
                outline: 'none', resize: 'vertical', marginBottom: '0.75rem',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: 'var(--accent)', color: '#fff', border: 'none',
                borderRadius: 10, padding: '0.65rem 1.5rem', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <Send size={15} />
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '1rem', marginBottom: '1.5rem',
            textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem',
          }}>
            <Link href="/login" style={{ color: 'var(--accent)' }}>Sign in</Link> to leave a comment
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.map(c => (
            <div key={c._id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.6rem' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
                  {c.author?.name?.[0]}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.author?.name}</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ color: '#c8c8e0', fontSize: '0.9rem', lineHeight: 1.6 }}>{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}