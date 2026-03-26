import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IAvatar extends Document {
  userId: Types.ObjectId;
  name: string;
  imageUrl: string;
  imagePublicId: string;
  audioSampleUrl: string;
  audioSamplePublicId: string;
  elevenLabsVoiceId: string;
  voiceCloneStatus: 'pending' | 'processing' | 'ready' | 'failed';
  isDefault: boolean;
  videosCreated: number;
  createdAt: Date;
  updatedAt: Date;
}

const AvatarSchema = new Schema<IAvatar>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Tên avatar là bắt buộc'],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
      required: true,
    },
    audioSampleUrl: {
      type: String,
      default: '',
    },
    audioSamplePublicId: {
      type: String,
      default: '',
    },
    elevenLabsVoiceId: {
      type: String,
      default: '',
    },
    voiceCloneStatus: {
      type: String,
      enum: ['pending', 'processing', 'ready', 'failed'],
      default: 'pending',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    videosCreated: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Avatar: Model<IAvatar> = mongoose.models.Avatar || mongoose.model<IAvatar>('Avatar', AvatarSchema);
export default Avatar;
