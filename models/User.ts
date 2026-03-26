import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  image: string;
  provider: 'google' | 'credentials';
  passwordHash?: string;
  plan: 'free' | 'creator' | 'agency';
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['google', 'credentials'],
      default: 'credentials',
    },
    passwordHash: {
      type: String,
    },
    plan: {
      type: String,
      enum: ['free', 'creator', 'agency'],
      default: 'free',
    },
    credits: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
