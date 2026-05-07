import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Comment from '@/models/Comment'
import Post from '@/models/Post'

type Params = { params: Promise<{ slug: string }> }

export async function GET(req: NextRequest, context: Params) {
  try {
    const { slug } = await context.params
    await connectDB()
    const post = await Post.findOne({ slug }).lean()
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    const comments = await Comment.find({ post: (post as any)._id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ comments })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, context: Params) {
  try {
    const { slug } = await context.params
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { content } = await req.json()
    if (!content) return NextResponse.json({ error: 'Content is required' }, { status: 400 })

    const post = await Post.findOne({ slug }).lean()
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    const comment = await Comment.create({
      content,
      author: session.user.id,
      post: (post as any)._id,
    })

    const populated = await comment.populate('author', 'name avatar')
    return NextResponse.json({ comment: populated }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}