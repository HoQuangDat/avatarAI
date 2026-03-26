import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IVideo extends Document {
  userId: Types.ObjectId;
  avatarId: Types.ObjectId;
  title: string;
  script: string;
  language: string;
  audioUrl: string;
  videoUrl: string;
  didTalkId: string;
  status: 'draft' | 'generating_audio' | 'generating_video' | 'ready' | 'failed';
  duration: number;
  resolution: '720p' | '1080p';
  errorMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    avatarId: {
      type: Schema.Types.ObjectId,
      ref: 'Avatar',
      required: true,
    },
    title: {
      type: String,
      default: 'Video chưa đặt tên',
    },
    script: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'vi',
    },
    audioUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    didTalkId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'generating_audio', 'generating_video', 'ready', 'failed'],
      default: 'draft',
    },
    duration: {
      type: Number,
      default: 0,
    },
    resolution: {
      type: String,
      enum: ['720p', '1080p'],
      default: '720p',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
export default Video;
