import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'author' },
      { new: true }
    )
    return NextResponse.json({ email: user.email, role: user.role })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}