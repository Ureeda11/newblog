import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'author' | 'reader'
  avatar?: string
  bio?: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['author', 'reader'], default: 'reader' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)