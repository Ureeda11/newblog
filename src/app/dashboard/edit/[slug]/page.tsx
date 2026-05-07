'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ImageIcon, X, Tag, Save, Globe, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const AIEditor = dynamic(() => import('@/components/AIEditor'), { ssr: false })

export default function EditPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (slug) fetchPost()
  }, [slug])

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/${slug}`)
      const data = await res.json()
      if (data.post) {
        setTitle(data.post.title || '')
        setExcerpt(data.post.excerpt || '')
        setContent(data.post.content || '')
        setTags(data.post.tags || [])
        setCoverImage(data.post.coverImage || '')
      }
    } catch (err) {
      console.error('Failed to fetch post:', err)
    }
    setLoading(false)
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.url) setCoverImage(data.url)
    setUploading(false)
  }

  async function handleSave(publishStatus: 'draft' | 'published') {
    if (!title || !content || !excerpt) {
      alert('Title, excerpt and content are required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          tags,
          coverImage,
          status: publishStatus,
        }),
      })
      if (res.ok) {
        router.push('/dashboard')
      } else {
        const text = await res.text()
        const data = text ? JSON.parse(text) : {}
        alert(data.error || 'Failed to save')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--muted)' }}>Loading post...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900 }}>Edit Post</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.6rem 1.2rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            <Save size={15} /> Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent)', border: 'none', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
          >
            {saving ? <Loader2 size={15} /> : <Globe size={15} />}
            {saving ? 'Saving...' : 'Update & Publish'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Post title..."
          style={{ width: '100%', padding: '1rem', fontSize: '1.4rem', fontFamily: 'Playfair Display, serif', fontWeight: 700, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', outline: 'none' }}
        />

        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="Short excerpt..."
          rows={2}
          style={{ width: '100%', padding: '0.9rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: '0.95rem', outline: 'none', resize: 'none', fontFamily: 'DM Sans, sans-serif' }}
        />

        <div>
          {coverImage ? (
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 200 }}>
              <img src={coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => setCoverImage('')}
                style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{ width: '100%', padding: '1.5rem', background: 'var(--surface)', border: '2px dashed var(--border)', borderRadius: 12, cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.9rem' }}
            >
              <ImageIcon size={18} />
              {uploading ? 'Uploading...' : 'Click to upload cover image'}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: tags.length ? '0.6rem' : 0 }}>
            {tags.map(tag => (
              <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(108,99,255,0.15)', color: 'var(--accent)', padding: '0.25rem 0.6rem', borderRadius: 6, fontSize: '0.8rem' }}>
                {tag}
                <button onClick={() => setTags(tags.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0, display: 'flex' }}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag size={15} color="var(--muted)" />
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Add tag and press Enter..."
              style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: '0.875rem', outline: 'none', flex: 1 }}
            />
          </div>
        </div>

        {!loading && (
          <AIEditor key={content} content={content} onChange={setContent} />
        )}
      </div>
    </div>
  )
}