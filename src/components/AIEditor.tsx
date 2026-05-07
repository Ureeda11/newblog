'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useState } from 'react'
import {
  Bold, Italic, Heading2, Heading3, List, Link as LinkIcon,
  Image as ImageIcon, Sparkles, Wand2, Loader2, X
} from 'lucide-react'

interface AIEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function AIEditor({ content, onChange }: AIEditorProps) {
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiType, setAiType] = useState<'full' | 'intro' | 'improve'>('full')
  const [aiLoading, setAiLoading] = useState(false)
  const [showAI, setShowAI] = useState(false)

 const editor = useEditor({
    immediatelyRender: false,
    extensions: [
  StarterKit.configure({ dropcursor: false }),
  Image,
  Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
  Placeholder.configure({ placeholder: 'Start writing your story...' }),
],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        style: 'min-height: 400px; outline: none; padding: 1.5rem;',
      },
    },
  })

  async function generateAI() {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, type: aiType }),
      })
      const data = await res.json()
      if (data.content && editor) {
        if (aiType === 'improve') {
          editor.commands.setContent(data.content)
        } else {
          editor.commands.insertContent(data.content)
        }
        onChange(editor.getHTML())
        setShowAI(false)
        setAiPrompt('')
      }
    } catch (err) {
      console.error('AI error:', err)
    }
    setAiLoading(false)
  }

  if (!editor) return null

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', background: 'var(--surface)' }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap',
        padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)',
        background: 'rgba(0,0,0,0.2)',
      }}>
        {[
          { icon: <Bold size={16} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), tip: 'Bold' },
          { icon: <Italic size={16} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), tip: 'Italic' },
          { icon: <Heading2 size={16} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), tip: 'Heading 2' },
          { icon: <Heading3 size={16} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), tip: 'Heading 3' },
          { icon: <List size={16} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), tip: 'List' },
        ].map((btn, i) => (
          <button key={i} onClick={btn.action} title={btn.tip} style={{
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: btn.active ? 'var(--accent)' : 'transparent',
            color: btn.active ? '#fff' : 'var(--muted)',
            border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {btn.icon}
          </button>
        ))}

        <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />

        {/* AI Button */}
        <button onClick={() => setShowAI(!showAI)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: showAI ? 'var(--accent)' : 'rgba(108,99,255,0.15)',
          color: showAI ? '#fff' : 'var(--accent)',
          border: `1px solid ${showAI ? 'var(--accent)' : 'rgba(108,99,255,0.3)'}`,
          borderRadius: 8, padding: '0.3rem 0.8rem',
          cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.2s',
        }}>
          <Sparkles size={14} /> AI Write
        </button>
      </div>

      {/* AI Panel */}
      {showAI && (
        <div style={{
          padding: '1.2rem', borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.08), rgba(255,101,132,0.05))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wand2 size={16} color="var(--accent)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)' }}>AI Writing Assistant</span>
            </div>
            <button onClick={() => setShowAI(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          {/* Type Selector */}
          <div style={{ display: 'flex', gap: 6, marginBottom: '0.9rem' }}>
            {[
              { value: 'full', label: '📝 Full Post' },
              { value: 'intro', label: '🎯 Introduction' },
              { value: 'improve', label: '✨ Improve' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setAiType(opt.value as any)} style={{
                padding: '0.35rem 0.8rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem',
                border: `1px solid ${aiType === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                background: aiType === opt.value ? 'rgba(108,99,255,0.2)' : 'transparent',
                color: aiType === opt.value ? 'var(--accent)' : 'var(--muted)',
                transition: 'all 0.15s',
              }}>
                {opt.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateAI()}
              placeholder={
                aiType === 'improve'
                  ? 'Describe how to improve the content...'
                  : 'Enter your blog topic...'
              }
              style={{
                flex: 1, padding: '0.65rem 1rem',
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--text)', fontSize: '0.875rem', outline: 'none',
              }}
            />
            <button onClick={generateAI} disabled={aiLoading || !aiPrompt.trim()} style={{
              background: 'var(--accent)', color: '#fff', border: 'none',
              borderRadius: 8, padding: '0.65rem 1.2rem', cursor: aiLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
              opacity: aiLoading ? 0.7 : 1,
            }}>
              {aiLoading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              {aiLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.8 }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}