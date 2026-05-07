import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'

type Params = { params: Promise<{ slug: string }> }

export async function POST(req: NextRequest, context: Params) {
  try {
    const { slug } = await context.params
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const post = await Post.findOne({ slug })
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    const userId = session.user.id
    const alreadyLiked = post.likes.some((id: any) => id.toString() === userId)

    if (alreadyLiked) {
      post.likes = post.likes.filter((id: any) => id.toString() !== userId)
      post.likesCount = Math.max(0, post.likesCount - 1)
    } else {
      post.likes.push(userId as any)
      post.likesCount += 1
    }

    await post.save()
    return NextResponse.json({ likesCount: post.likesCount, liked: !alreadyLiked })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}