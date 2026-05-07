import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    console.log('=== REGISTER API CALLED ===')
    
    const body = await req.json()
    console.log('Body received:', { ...body, password: '***' })
    
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    console.log('Connecting to MongoDB...')
    await connectDB()
    console.log('MongoDB connected!')

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'reader',
    })

    console.log('User created:', user._id)

    return NextResponse.json(
      { message: 'User created successfully', userId: user._id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('=== REGISTER ERROR ===', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      details: error.toString()
    }, { status: 500 })
  }
}