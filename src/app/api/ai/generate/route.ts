import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'author') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, type } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    let fullPrompt = ''
    if (type === 'full') {
      fullPrompt = `Write a complete, well-structured blog post about: "${prompt}". 
      Include an engaging introduction, detailed sections with subheadings, and a conclusion.
      Format with HTML tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>.
      Make it informative, engaging and around 600-800 words.`
    } else if (type === 'improve') {
      fullPrompt = `Improve and enhance this blog content while keeping the main ideas: "${prompt}".
      Make it more engaging, fix grammar, improve flow. Return formatted HTML.`
    } else {
      fullPrompt = `Generate a creative blog post introduction paragraph for the topic: "${prompt}".
      Make it engaging and hook the reader. Return as HTML paragraph.`
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: fullPrompt }],
      model: 'llama-3.3-70b-versatile',
    })

    const text = completion.choices[0]?.message?.content || ''
    return NextResponse.json({ content: text })
  } catch (error: any) {
    console.error('AI generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}