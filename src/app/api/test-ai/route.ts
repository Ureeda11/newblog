import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY is missing' }, { status: 500 })
    }

    const groq = new Groq({ apiKey })
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Write one sentence about blogging.' }],
      model: 'llama-3.3-70b-versatile',
    })

    const text = completion.choices[0]?.message?.content || ''
    return NextResponse.json({ success: true, text })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}