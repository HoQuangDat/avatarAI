import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function fixAvatars() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return;

  const cleanUri = uri.replace('w=majority/', 'w=1').replace('w=majority', 'w=1');

  try {
    await mongoose.connect(cleanUri);
    const db = mongoose.connection.db;

    if (db) {
       await db.collection('avatars').updateMany(
        { elevenLabsVoiceId: 'pNInz6obpgDQGcFmaJcg' },
        { 
          $set: { 
            elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM' 
          } 
        }
      );
      console.log('Fixed stuck avatars!');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixAvatars();
