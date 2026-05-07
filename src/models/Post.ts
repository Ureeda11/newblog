import mongoose, { Schema, Document } from 'mongoose'

export interface IPost extends Document {
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  author: mongoose.Types.ObjectId
  status: 'draft' | 'published'
  tags: string[]
  likes: mongoose.Types.ObjectId[]
  likesCount: number
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String, default: '' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    tags: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)