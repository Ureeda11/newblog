import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    const query: any = { status: 'published' }
    if (tag) query.tags = { $in: [tag] }
    if (search) query.title = { $regex: search, $options: 'i' }

    const total = await Post.countDocuments(query)
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'author') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const body = await req.json()
    const { title, content, excerpt, coverImage, tags, status } = body

    if (!title || !content || !excerpt) {
      return NextResponse.json({ error: 'Title, content and excerpt are required' }, { status: 400 })
    }

    const slug =
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
      '-' + Date.now()

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      coverImage: coverImage || '',
      author: session.user.id,
      tags: tags || [],
      status: status || 'draft',
    })

    return NextResponse.json({ post: JSON.parse(JSON.stringify(post)) }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}